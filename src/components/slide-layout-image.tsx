/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";
import { SlideLayout, Slide } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useSheetVisibility } from "@/lib/hooks/use-sheet-visibility";
import { useSlideActions } from "@/lib/actions/slide.client";
import { memo } from "react";

const DEFAULT_IMAGE_WIDTH = 35;
const MIN_IMAGE_WIDTH = 15;
const MAX_IMAGE_WIDTH = 70;

const isSideImageLayout = (layout?: SlideLayout) =>
  layout === SlideLayout.LEFT_IMAGE || layout === SlideLayout.RIGHT_IMAGE;

export default memo(function SlideLayoutImage({
  slide,
  isPresenting,
}: {
  slide: Slide;
  isPresenting: boolean;
}) {
  const [showPopover, setShowPopover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const dragWidthRef = useRef<number | null>(null);
  const [, setSheetVisibility] = useSheetVisibility();
  const { deleteSlideImage, updateSlideImageWidth } = useSlideActions();
  const updateSlideImageWidthRef = useRef(updateSlideImageWidth);
  updateSlideImageWidthRef.current = updateSlideImageWidth;
  const dragStateRef = useRef<{
    startX: number;
    containerWidth: number;
    initialWidth: number;
    isReversed: boolean;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleShowPopover = () => {
    if (!isPresenting) {
      setShowPopover((state) => !state);
    }
  };

  const imageWidth = dragWidth ?? slide.layoutImageWidth ?? DEFAULT_IMAGE_WIDTH;

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const container = containerRef.current?.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    dragStateRef.current = {
      startX: e.clientX,
      containerWidth: rect.width,
      initialWidth: slide.layoutImageWidth ?? DEFAULT_IMAGE_WIDTH,
      isReversed: slide.layout === SlideLayout.RIGHT_IMAGE,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    document.body.style.cursor = "col-resize";

    const onMouseMove = (e: MouseEvent) => {
      const state = dragStateRef.current;
      if (!state) return;

      const deltaX = e.clientX - state.startX;
      const deltaPct = (deltaX / state.containerWidth) * 100;

      const newWidth = state.isReversed
        ? state.initialWidth - deltaPct
        : state.initialWidth + deltaPct;

      const clamped = Math.round(
        Math.min(MAX_IMAGE_WIDTH, Math.max(MIN_IMAGE_WIDTH, newWidth)) * 10
      ) / 10;

      dragWidthRef.current = clamped;
      setDragWidth(clamped);
    };

    const onMouseUp = () => {
      const finalWidth = dragWidthRef.current;
      if (finalWidth !== null) {
        updateSlideImageWidthRef.current(slide.id, finalWidth);
      }
      dragStateRef.current = null;
      dragWidthRef.current = null;
      setDragWidth(null);
      setIsDragging(false);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, slide.id]);

  if (slide.layout === SlideLayout.WITHOUT) {
    return null;
  }

  const isSide = isSideImageLayout(slide.layout);

  return (
    <Popover open={showPopover} onOpenChange={handleShowPopover}>
      <PopoverTrigger asChild>
        <div
          ref={containerRef}
          className={cn(
            "flex shrink-0 w-full overflow-hidden relative",
            slide.layout === SlideLayout.TOP_IMAGE && "h-[30%]",
            isSide && "h-full",
            isDragging && "select-none",
            {
              "bg-[var(--slide-card-background)]": !slide.layoutImageUrl,
            }
          )}
          style={isSide ? { width: `${imageWidth}%` } : undefined}
        >
          {slide.layoutImageUrl ? (
            <img
              data-image-cover
              src={slide.layoutImageUrl}
              alt="layout image"
              className={cn(
                "object-cover object-center w-full h-full select-none",
                isSide && "layout-image-mask"
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

          {!isPresenting && isSide && (
            <div
              className="absolute top-0 h-full pointer-events-auto cursor-col-resize z-10"
              style={{
                width: "24px",
                right: slide.layout === SlideLayout.LEFT_IMAGE ? "-12px" : undefined,
                left: slide.layout === SlideLayout.RIGHT_IMAGE ? "-12px" : undefined,
              }}
              onMouseDown={onResizeStart}
            >
              <div
                className={cn(
                  "h-full mx-auto rounded-full transition-all",
                  isDragging
                    ? "w-[3px] bg-primary"
                    : "w-px bg-transparent hover:w-[3px] hover:bg-primary/50"
                )}
              />
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
