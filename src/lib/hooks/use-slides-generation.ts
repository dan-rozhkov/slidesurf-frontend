import { useIsPresentingAtom } from "./use-is-presenting";
import { useImageGeneration } from "./use-image-generation";
import { usePresentationAtom } from "./use-presentation";
import { usePresentationData } from "./use-presentation-data";
import {
  Section,
  SlideVerticalAlign,
  Slide,
  SlideLayout,
  Attachment,
  ContentSettings,
} from "@/types";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { parseSlideBlock } from "@/lib/client/parsers/slide-parser";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSubscriptionDialog } from "@/lib/hooks/use-subscription-dialog";

type GenerateSlidesParams = {
  prompt: string;
  slidesCount: number;
  slidesPlan?: Section[];
  model?: string;
  attachments?: Attachment[];
  contentSettings?: ContentSettings;
};

export const useSlidesGeneration = () => {
  const { generateImage } = useImageGeneration();
  const [, setIsPresenting] = useIsPresentingAtom();
  const [presentationAtom, setPresentationAtom] = usePresentationAtom();
  const [presentationData, setPresentationData] = usePresentationData();
  const queryClient = useQueryClient();
  const [, setSubscriptionDialogOpen] = useSubscriptionDialog();

  const generateSlides = useCallback(
    async (params: GenerateSlidesParams) => {
      const {
        prompt,
        slidesCount,
        slidesPlan,
        model,
        attachments,
        contentSettings,
      } = params;

      setIsPresenting(true);
      const slides: Slide[] = new Array(slidesCount)
        .fill(null)
        .map((_, index) => {
          const id = `${nanoid()}`;
          const layout = "without" as SlideLayout;
          const verticalAlign = "center" as SlideVerticalAlign;
          const content = `<p>Слайд ${index + 1}</p>`;

          return {
            id,
            layout,
            verticalAlign,
            content,
            index,
          };
        });

      try {
        const response = await fetch("/api/generate/slides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            slidesCount,
            slidesPlan,
            model: model || presentationData?.model,
            attachments,
            contentSettings,
          }),
        });

        // Check for HTTP errors
        if (!response.ok) {
          const errorText = await response.text();
          try {
            const errorData = JSON.parse(errorText);
            if (
              errorData.code === "SUBSCRIPTION_LIMIT_EXCEEDED" ||
              response.status === 403
            ) {
              setSubscriptionDialogOpen(true);
              toast.error(errorData.error || "Subscription limit exceeded");
            } else {
              toast.error(
                errorData.error || errorText || "Failed to generate slides"
              );
            }
          } catch {
            if (response.status === 403) {
              setSubscriptionDialogOpen(true);
              toast.error("Subscription limit exceeded");
            } else {
              toast.error(errorText || "Failed to generate slides");
            }
          }
          setIsPresenting(false);
          return null;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          setIsPresenting(false);
          return null;
        }
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          buffer += chunk;

          // Split by "-----" and parse each block
          const slideBlocks = buffer.split("-----");

          for (const block of slideBlocks) {
            const slidePartial = parseSlideBlock(block);
            if (slidePartial && slidePartial.index !== undefined) {
              slides[slidePartial.index] = {
                ...slides[slidePartial.index],
                ...slidePartial,
              } as Slide;

              if (slideBlocks[slideBlocks.length - 1] === block) {
                setPresentationAtom({
                  ...presentationAtom,
                  slides: [...slides],
                });
              }
            }
          }
        }
      } catch (error) {
        console.error("Error generating slides:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to generate slides"
        );
        setIsPresenting(false);
        return null;
      }

      setIsPresenting(false);

      try {
        // Add image generation for slides with layouts
        const slidesWithLayouts = slides.filter(
          (slide) => slide.layout !== "without"
        );

        await Promise.all(
          slidesWithLayouts.map(async (slide) => {
            try {
              // Get image prompt
              const promptResponse = await fetch("/api/generate/image/prompt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  slideContent: slide.content,
                }),
              });
              const prompt = await promptResponse.text();
              const imageUrl = await generateImage(prompt);

              // Update slide with image
              slides[slide.index as number] = {
                ...slides[slide.index as number],
                layoutImageUrl: imageUrl,
              };
            } catch (error) {
              console.error("Error generating image for slide:", error);
            }
          })
        );

        const newPresentation = {
          ...presentationAtom,
          id: nanoid(),
          title: slidesPlan?.[0]?.title ?? "Новая презентация",
          slides,
        };

        setPresentationData({
          slidesPlan: null,
          attachments: null,
          model: null,
          contentSettings: null,
          planId: null,
        });
        setPresentationAtom(newPresentation);

        // Invalidate generations usage cache after successful generation
        queryClient.invalidateQueries({ queryKey: ["generations-usage"] });

        return newPresentation;
      } catch (error) {
        console.error("Error in post-generation processing:", error);
        // Return presentation even if image generation fails
        const newPresentation = {
          ...presentationAtom,
          id: nanoid(),
          title: slidesPlan?.[0]?.title ?? "Новая презентация",
          slides,
        };

        setPresentationData({
          slidesPlan: null,
          attachments: null,
          model: null,
          contentSettings: null,
          planId: null,
        });
        setPresentationAtom(newPresentation);

        // Invalidate generations usage cache after successful generation
        queryClient.invalidateQueries({ queryKey: ["generations-usage"] });

        return newPresentation;
      }
    },
    [
      setIsPresenting,
      generateImage,
      setPresentationData,
      presentationAtom,
      setPresentationAtom,
      presentationData,
      queryClient,
      setSubscriptionDialogOpen,
    ]
  );

  return { generateSlides };
};
