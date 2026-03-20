
import { Trash2, Shuffle, Loader, Copy } from "lucide-react";
import { Button } from "./ui/button";
import SlideSettingsPopover from "./slide-settings-popover";
import SlideAIPopover from "./slide-ai-popover";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { useTheme } from "@/lib/hooks/use-theme";
import { Slide, SlideLayout } from "@/types";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { useSlideActions } from "@/lib/actions/slide.client";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useScopedI18n } from "@/lib/locales/client";

export default function SlideActions({ slide }: { slide: Slide }) {
  const [presentationAtom, setPresentationAtom] = usePresentationAtom();
  const { theme } = useTheme(presentationAtom?.themeId || null);
  const [isShuffleLoading, setIsShuffleLoading] = useState(false);
  const { updateSlideContentWithTemplate } = useSlideActions();
  const t = useScopedI18n("editor");

  const removeSlide = (id: string) => {
    if (presentationAtom.slides.length > 1) {
      setPresentationAtom({
        ...presentationAtom,
        slides: presentationAtom.slides.filter((slide) => slide.id !== id),
      });
    }
  };

  const copySlide = (slide: Slide) => {
    const newSlide: Slide = {
      ...slide,
      id: crypto.randomUUID(),
    };

    const slideIndex = presentationAtom.slides.findIndex(
      (s) => s.id === slide.id
    );
    const newSlides = [...presentationAtom.slides];
    newSlides.splice(slideIndex + 1, 0, newSlide);

    setPresentationAtom({
      ...presentationAtom,
      slides: newSlides,
    });
  };

  const handleLayoutChange = (id: string, layout: SlideLayout) => {
    setPresentationAtom({
      ...presentationAtom,
      slides: presentationAtom.slides.map((slide) =>
        slide.id === id ? { ...slide, layout } : slide
      ),
    });
  };

  const handleSlideUpdate = (
    id: string,
    field: keyof Slide,
    value: string | undefined
  ) => {
    setPresentationAtom({
      ...presentationAtom,
      slides: presentationAtom.slides.map((slide) =>
        slide.id === id ? { ...slide, [field]: value } : slide
      ),
    });
  };

  const handleShuffle = async () => {
    setIsShuffleLoading(true);

    try {
      const response = await fetch("/api/generate/suffle", {
        method: "POST",
        body: JSON.stringify({ slideContent: slide.content }),
      });

      const { content, template } = await response.json();
      updateSlideContentWithTemplate(slide.id, content, template);
    } catch (error) {
      console.error(error);
    } finally {
      setIsShuffleLoading(false);
    }
  };

  return (
    <div className="absolute -top-0 -translate-y-1/2 left-[50%] -translate-x-1/2 flex gap-0.5 z-[2] rounded-lg bg-background border border-border p-0.5 shadow-md group-hover:opacity-100 opacity-0 transition-opacity duration-200">
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 w-auto h-auto"
            onClick={(e) => {
              e.stopPropagation();
              handleShuffle();
            }}
            disabled={isShuffleLoading}
          >
            {isShuffleLoading ? (
              <Loader className="size-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <Shuffle className="size-4" strokeWidth={1.5} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          {t("shuffle")}
        </TooltipContent>
      </Tooltip>

      <ToggleGroup
        type="single"
        defaultValue={slide.layout ?? SlideLayout.WITHOUT}
        className="gap-0"
        onValueChange={(value) => {
          if (!value) {
            return;
          }

          handleLayoutChange(slide.id, value as SlideLayout);
        }}
      >
        {Object.values(SlideLayout)
          .filter((layout) => {
            // Filter only applies to TITUL, SECTION_INTRO, and FINAL layouts
            if (
              [
                SlideLayout.TITUL,
                SlideLayout.SECTION_INTRO,
                SlideLayout.FINAL,
              ].includes(layout)
            ) {
              return theme?.colors?.themeLayouts?.[layout] !== undefined;
            }
            // Show other layouts always
            return true;
          })
          .map((layout) => (
            <Tooltip key={layout} delayDuration={300}>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value={layout}
                  className="p-0 w-auto h-full data-[state=on]:bg-muted"
                >
                  <div className="relative w-[20px] aspect-video border border-neutral-600 dark:border-neutral-300 rounded-[2px]">
                    <div
                      className={`absolute bg-neutral-600 dark:bg-neutral-300 layout-${layout}`}
                    />
                  </div>
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                {t(`layouts.${layout}`)}
              </TooltipContent>
            </Tooltip>
          ))}
      </ToggleGroup>

      <SlideSettingsPopover
        slide={slide}
        onSlideUpdate={(field, value) => {
          handleSlideUpdate(slide.id, field, value);
        }}
      />

      <Separator
        orientation="vertical"
        className="h-[20px] w-px bg-border mt-1.5 mx-0.5"
      />

      <SlideAIPopover slide={slide} />

      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 w-auto h-auto"
            onClick={(e) => {
              e.stopPropagation();
              copySlide(slide);
            }}
          >
            <Copy className="size-4" strokeWidth={1.5} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          {t("copy")}
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 w-auto h-auto"
            onClick={(e) => {
              e.stopPropagation();
              removeSlide(slide.id);
            }}
          >
            <Trash2 className="size-4" strokeWidth={1.5} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          {t("trash")}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
