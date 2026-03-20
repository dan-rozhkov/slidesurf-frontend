
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditImageSheet } from "@/components/edit-image-sheet";
import { Plus } from "lucide-react";
import Toolbar from "@/components/toolbar";
import { nanoid } from "@/lib/utils";
import SlidesPreview from "@/components/slides-preview";
import {
  Slide as SlideType,
  SlideLayout,
  SlideVerticalAlign,
  SlidesTemplates,
  SlidePlaceholder as SlidePlaceholderType,
} from "@/types";
import { useZoom } from "@/lib/hooks/use-zoom";
import { newSlideContent } from "@/lib/templates/new-slide-content";
import { SlideWrapper } from "./slide-wrapper";
import { SlidesTemplatesPopover } from "./slides-templates-popover";
import { useSlideActions } from "@/lib/actions/slide.client";
import { useCurrentSlideIdAtom } from "@/lib/hooks/use-current-slide-id";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { useSlidesGeneration } from "@/lib/hooks/use-slides-generation";
import {
  createPresentation,
  updatePresentation,
} from "@/api/presentations";
import { Presentation } from "@/types";
import { useDebouncedCallback } from "use-debounce";
import { useIsPresentingAtom } from "@/lib/hooks/use-is-presenting";
import { useScopedI18n } from "@/lib/locales/client";
import { EditorSnippets } from "./editor-snippets";
import SlideActions from "./slide-actions";
import AgentChat from "./agent-chat";
import { usePresentationData } from "@/lib/hooks/use-presentation-data";
import { SlidePlaceholder } from "./editor/slide-placeholder";
import { FeedbackRatingCard } from "./feedback-rating-card";
import { useTheme } from "@/lib/hooks/use-theme";
import { useChatOpenAtom } from "@/lib/hooks/use-chat-open";

const Editor = ({
  initialPresentation,
}: {
  initialPresentation: Presentation | undefined;
}) => {
  const t = useScopedI18n("editor");
  const containerRef = useRef<HTMLDivElement>(null);
  const { zoom, setZoom, fontSize, calculateFontSize } = useZoom(containerRef);
  const [currentSlideId, setCurrentSlideId] = useCurrentSlideIdAtom();
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const { getSlideTemplateContent, screenshotSlide } = useSlideActions();
  const { generateSlides } = useSlidesGeneration();
  const [presentationAtom, setPresentationAtom] = usePresentationAtom();
  const [isPresenting, setIsPresenting] = useIsPresentingAtom();
  const hasGeneratedRef = useRef(false);
  const isGeneratingRef = useRef(false);
  const [isChatOpen, setIsChatOpen] = useChatOpenAtom();
  const { theme } = useTheme(presentationAtom?.themeId || null);
  const debouncedUpdatePresentation = useDebouncedCallback(
    updatePresentation,
    1000
  );
  const debouncedCalculateFontSize = useDebouncedCallback(calculateFontSize, 0);
  const debouncedScreenshotSlide = useDebouncedCallback(screenshotSlide, 3000);
  const [presentationData] = usePresentationData();
  const [slidePlaceholder, setSlidePlaceholder] =
    useState<SlidePlaceholderType | null>(null);
  const slidePlaceholderRef = useRef<HTMLDivElement>(null);

  const handleGenerateSlides = useCallback(async () => {
    if (presentationData.slidesPlan) {
      isGeneratingRef.current = true;
      debouncedUpdatePresentation.cancel();
      try {
        const newPresentation = await generateSlides({
          prompt: presentationData.slidesPlan[0].title,
          slidesCount: presentationData.slidesPlan.length,
          slidesPlan: presentationData.slidesPlan,
          attachments: presentationData.attachments || [],
          contentSettings: presentationData.contentSettings ?? undefined,
        });

        if (newPresentation) {
          await createPresentation({
            ...newPresentation,
            planId: presentationData.planId,
          });
          window.history.pushState(null, "", `/editor/${newPresentation.id}`);
        }
      } finally {
        isGeneratingRef.current = false;
      }
    }
  }, [generateSlides, presentationData, debouncedUpdatePresentation]);

  useEffect(() => {
    // If no presentation, create a new presentation with default slide
    if (!initialPresentation) {
      const slides = [
        {
          id: nanoid(),
          content: newSlideContent,
          verticalAlign: SlideVerticalAlign.CENTER,
          layout: SlideLayout.LEFT_IMAGE,
        },
      ];

      setPresentationAtom({
        id: nanoid(),
        title: t("newPresentation"),
        slides,
        themeId: "default",
      });

      return;
    }

    if (initialPresentation && initialPresentation?.slides) {
      setPresentationAtom(initialPresentation);
    }
  }, [initialPresentation, setPresentationAtom]);

  useEffect(() => {
    if (hasGeneratedRef.current) {
      return;
    }

    setIsPresenting(false);

    if (presentationData.slidesPlan && presentationData.slidesPlan.length > 0) {
      hasGeneratedRef.current = true;
      handleGenerateSlides();
    }
  }, []);

  // Update presentation when it's not presenting or generating slides
  useEffect(() => {
    if (presentationAtom && !isPresenting && !isGeneratingRef.current) {
      debouncedUpdatePresentation(presentationAtom.id, {
        slides: presentationAtom.slides,
      });
    }
  }, [presentationAtom, debouncedUpdatePresentation, isPresenting]);

  // Recalculate font size when chat opens/closes
  useEffect(() => {
    debouncedCalculateFontSize();
  }, [isChatOpen, debouncedCalculateFontSize]);

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  const handleSlideChange = async (id: string, content: string) => {
    const updatedSlides = presentationAtom.slides.map((slide) =>
      slide.id === id ? { ...slide, content } : slide
    );

    if (id === presentationAtom.slides[0].id) {
      await debouncedScreenshotSlide(id);
    }

    setPresentationAtom({
      ...presentationAtom,
      slides: updatedSlides,
    });
  };

  const debouncedHandleSlideChange = useDebouncedCallback(
    handleSlideChange,
    300
  );

  const addSlide = useCallback(
    (afterId?: string, template?: SlidesTemplates, content?: string) => {
      let newSlide: SlideType = {
        id: nanoid(),
        content: content || newSlideContent,
        verticalAlign: SlideVerticalAlign.CENTER,
        layout: SlideLayout.LEFT_IMAGE,
      };

      if (template) {
        const templateContent = getSlideTemplateContent(template);

        newSlide = {
          ...newSlide,
          ...templateContent,
          content: content || (templateContent.content as string),
        };
      }

      if (afterId) {
        const index = presentationAtom.slides.findIndex(
          (slide) => slide.id === afterId
        );
        setPresentationAtom({
          ...presentationAtom,
          slides: [
            ...presentationAtom.slides.slice(0, index + 1),
            newSlide,
            ...presentationAtom.slides.slice(index + 1),
          ],
        });
      } else {
        setPresentationAtom({
          ...presentationAtom,
          slides: [...presentationAtom.slides, newSlide],
        });
      }

      setCurrentSlideId(newSlide.id);
    },
    [
      presentationAtom,
      setPresentationAtom,
      setCurrentSlideId,
      getSlideTemplateContent,
    ]
  );

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <div className="flex w-full">
        <Toolbar />
      </div>
      <div className="flex grow w-full overflow-hidden">
        <SlidesPreview
          currentSlideId={currentSlideId}
          onSlideSelect={(id) => {
            setCurrentSlideId(id);

            const slideElement = slidesRef.current.find(
              (el, idx) =>
                presentationAtom.slides[idx]?.id === id && el !== null
            );
            if (slideElement) {
              slideElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }}
          setSlidePlaceholder={setSlidePlaceholder}
        />
        <div className="flex flex-1 overflow-hidden">
          <div
            ref={containerRef}
            className="flex-1 overflow-auto p-4 overflow-x-hidden"
            style={{ overflowAnchor: "none" }}
          >
            <div
              style={{ fontSize: `${fontSize}px` }}
              className="flex flex-col items-center justify-center"
            >
              {presentationAtom.slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="group mb-4 relative mx-auto flex flex-col items-center justify-center"
                  onClick={() => {
                    if (currentSlideId !== slide.id) {
                      setCurrentSlideId(slide.id);
                    }
                  }}
                >
                  <SlideWrapper
                    slide={slide}
                    isActive={currentSlideId === slide.id}
                    onUpdate={(content) =>
                      debouncedHandleSlideChange(slide.id, content)
                    }
                    ref={(el) => {
                      slidesRef.current[index] = el;
                    }}
                    isEditable={true}
                    isPresenting={false}
                    theme={theme}
                  />

                  <SlideActions slide={slide} />

                  {slidePlaceholder?.afterSlideId === slide.id ? (
                    <SlidePlaceholder
                      afterSlideId={slide.id}
                      id={slidePlaceholder.id}
                      ref={slidePlaceholderRef}
                      onCancel={() => setSlidePlaceholder(null)}
                      onGenerate={(
                        content: string,
                        template: SlidesTemplates
                      ) => {
                        addSlide(
                          slidePlaceholder.afterSlideId,
                          template,
                          content
                        );
                        setSlidePlaceholder(null);
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-0 mt-4 group-hover:opacity-100 opacity-0 transition-opacity duration-200 shadow-lg rounded-lg border border-border">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSlidePlaceholder({
                            id: nanoid(),
                            type: "placeholder",
                            afterSlideId: slide.id,
                          });
                        }}
                        variant="ghost"
                        size="sm"
                        className="rounded-r-none rounded-l-lg border-r border-border"
                      >
                        <Plus className="size-4 mr-1" strokeWidth={1.5} />{" "}
                        {t("addSlide")}
                      </Button>

                      <SlidesTemplatesPopover
                        onTemplateSelect={(template) => {
                          addSlide(slide.id, template);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}

              <FeedbackRatingCard presentationId={presentationAtom.id} />
            </div>
          </div>

          {isChatOpen && <AgentChat />}

          <EditorSnippets />

          {!isChatOpen && (
            <div className="fixed bottom-4 right-4 flex gap-2 items-center justify-end">
              <Select
                value={zoom.toString()}
                onValueChange={(value) => handleZoomChange([parseInt(value)])}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectZoom")} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (i + 5) * 10).map(
                    (value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value}%
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <EditImageSheet />
    </div>
  );
};

export default Editor;
