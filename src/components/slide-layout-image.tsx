/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";
import { SlideLayout, Slide } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useSheetVisibility } from "@/lib/hooks/use-sheet-visibility";
import { useSlideActions } from "@/lib/actions/slide.client";
import { memo } from "react";

export default memo(function SlideLayoutImage({
  slide,
  isPresenting,
}: {
  slide: Slide;
  isPresenting: boolean;
}) {
  const [showPopover, setShowPopover] = useState(false);
  const [, setSheetVisibility] = useSheetVisibility();
  const { deleteSlideImage } = useSlideActions();

  const handleShowPopover = () => {
    if (!isPresenting) {
      setShowPopover((state) => !state);
    }
  };

  if (slide.layout === SlideLayout.WITHOUT) {
    return null;
  }

  return (
    <Popover open={showPopover} onOpenChange={handleShowPopover}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex shrink-0 w-full overflow-hidden relative",
            slide.layout === SlideLayout.TOP_IMAGE
              ? "h-[30%]"
              : slide.layout === SlideLayout.LEFT_IMAGE
              ? "w-[35%] h-full"
              : slide.layout === SlideLayout.RIGHT_IMAGE
              ? "w-[35%] h-full"
              : "",
            {
              "bg-[var(--slide-card-background)]": !slide.layoutImageUrl,
            }
          )}
        >
          {slide.layoutImageUrl ? (
            <img
              data-image-cover
              src={slide.layoutImageUrl}
              alt="layout image"
              className={cn(
                "object-cover object-center w-full h-full select-none",
                slide.layout === SlideLayout.LEFT_IMAGE ||
                  slide.layout === SlideLayout.RIGHT_IMAGE
                  ? "layout-image-mask"
                  : ""
              )}
            />
          ) : (
            <div
              className={cn(
                "flex items-center justify-center w-full h-full cursor-pointer",
                slide.isLoadingLayoutImage && "animate-pulse"
              )}
              onClick={() => {
                if (!isPresenting) setSheetVisibility(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="fill-[var(--slide-foreground)] opacity-10 size-[2em]"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8.813 11.612c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.986 4.986l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l.292 -.293l.106 -.095c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.674 4.675a4 4 0 0 1 -3.775 3.599l-.206 .005h-12a4 4 0 0 1 -3.98 -3.603l6.687 -6.69l.106 -.095zm9.187 -9.612a4 4 0 0 1 3.995 3.8l.005 .2v9.585l-3.293 -3.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-.307 .306l-2.293 -2.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-5.307 5.306v-9.585a4 4 0 0 1 3.8 -3.995l.2 -.005h12zm-2.99 5l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
              </svg>
            </div>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent sideOffset={5} className="w-auto p-0.5">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg"
            onClick={() => setSheetVisibility(true)}
          >
            <Pencil className="size-4" strokeWidth={1.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg"
            onClick={() => deleteSlideImage(slide.id)}
          >
            <Trash2 className="size-4" strokeWidth={1.5} />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
});
