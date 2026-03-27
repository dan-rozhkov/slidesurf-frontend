/* eslint-disable @next/next/no-img-element */

import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import {
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Ellipsis,
  SquarePen,
  Upload,
  Cat,
  Search,
  Sparkles,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNodeHasFocus } from "@/lib/hooks/use-node-has-focus";
import { Separator } from "@/components/ui/separator";
import { EditImageForm } from "@/components/edit-image-form";
import { useImageGeneration } from "../hooks/use-image-generation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import UploadImageForm from "@/components/upload-image-form";
import { SearchImages } from "@/components/search-images";
import { SearchNounIcons } from "@/components/search-noun-icons";
import { useScopedI18n } from "@/lib/locales/client";
import { useTheme } from "@/lib/hooks/use-theme";
import { usePresentationAtom } from "../hooks/use-presentation";

interface ImageAttributes {
  src: string;
  alt?: string;
  alignment?: "left" | "center" | "right";
  width?: string;
  height?: string;
}

type ResizeHandle = "left" | "right";
type ImageAlignment = NonNullable<ImageAttributes["alignment"]>;

const IMAGE_WIDTH_OPTIONS = ["5", "15", "25", "50", "60", "75", "90", "100"];
const MIN_IMAGE_WIDTH_PCT = 5;
const MAX_IMAGE_WIDTH_PCT = 100;

const parsePercentageValue = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : null;
};

const roundPercentageValue = (value: number) => Math.round(value * 10) / 10;

const formatPercentageValue = (value: number) =>
  roundPercentageValue(value).toString();

const getResizeHandles = (alignment: ImageAlignment): ResizeHandle[] => {
  switch (alignment) {
    case "left":
      return ["right"];
    case "right":
      return ["left"];
    default:
      return ["left", "right"];
  }
};

const ImageNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
  editor,
  selected,
  getPos,
}) => {
  const t = useScopedI18n("editor");
  const { isGenerating, generateImage } = useImageGeneration();
  const isEditable = editor.isEditable;
  const [isFocused, setIsFocused] = useState(false);
  const hasFocus = useNodeHasFocus(editor, getPos, node.nodeSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const [handleOffsets, setHandleOffsets] = useState<{
    left: number | null;
    right: number | null;
  }>({ left: null, right: null });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragWidthRef = useRef<number | null>(null);
  const dragStateRef = useRef<{
    handle: ResizeHandle;
    startX: number;
    containerWidth: number;
    initialWidth: number;
    alignment: NonNullable<ImageAttributes["alignment"]>;
  } | null>(null);
  const attrs = node.attrs as ImageAttributes;
  const [presentationAtom] = usePresentationAtom();
  const { theme } = useTheme(presentationAtom?.themeId || null);
  const alignment = attrs.alignment ?? "center";
  const currentWidth = dragWidth ?? parsePercentageValue(attrs.width);
  const selectWidthValue = attrs.width?.toString() ?? "100";
  const customWidthOption = IMAGE_WIDTH_OPTIONS.includes(selectWidthValue)
    ? null
    : selectWidthValue;
  const isNodeSelected = isFocused || selected;
  const isToolbarVisible = isNodeSelected || hasFocus;
  const imageHeight =
    isDragging || !attrs.height ? undefined : `${attrs.height}%`;
  const resizeHandles = getResizeHandles(alignment);
  const alignmentOptions = [
    { value: "left" as const, icon: AlignLeft },
    { value: "center" as const, icon: AlignCenter },
    { value: "right" as const, icon: AlignRight },
  ];

  const getAlignmentClasses = () => {
    switch (alignment) {
      case "left":
        return "mr-auto";
      case "right":
        return "ml-auto";
      default:
        return "mx-auto";
    }
  };

  const updateHandleOffsets = useCallback(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const nextOffsets = {
      left: imageRect.left - containerRect.left,
      right: imageRect.right - containerRect.left,
    };

    setHandleOffsets((prev) => {
      if (
        prev.left === nextOffsets.left &&
        prev.right === nextOffsets.right
      ) {
        return prev;
      }

      return nextOffsets;
    });
  }, []);

  useEffect(() => {
    updateHandleOffsets();

    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const observer = new ResizeObserver(updateHandleOffsets);
    observer.observe(container);
    observer.observe(image);

    return () => observer.disconnect();
  }, [updateHandleOffsets, attrs.alignment, attrs.width, attrs.height, dragWidth]);

  useEffect(() => {
    if (!isDragging) return;

    document.body.style.cursor = "col-resize";

    const onMouseMove = (event: MouseEvent) => {
      const state = dragStateRef.current;
      if (!state) return;

      let deltaPct =
        ((event.clientX - state.startX) / state.containerWidth) * 100;

      if (state.alignment === "center") {
        deltaPct *= 2;
      }

      if (state.handle === "left") {
        deltaPct *= -1;
      }

      const nextWidth = roundPercentageValue(
        Math.min(
          MAX_IMAGE_WIDTH_PCT,
          Math.max(MIN_IMAGE_WIDTH_PCT, state.initialWidth + deltaPct)
        )
      );

      dragWidthRef.current = nextWidth;
      setDragWidth(nextWidth);
    };

    const onMouseUp = () => {
      const finalWidth = dragWidthRef.current;
      if (finalWidth !== null) {
        const nextWidth = formatPercentageValue(finalWidth);
        if (nextWidth !== attrs.width || attrs.height !== null) {
          updateAttributes({ width: nextWidth, height: null });
        }
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
  }, [attrs.height, attrs.width, isDragging, updateAttributes]);

  const handleGenerateImage = useCallback(
    async (prompt: string) => {
      const imageUrl = await generateImage(prompt);

      if (imageUrl) {
        updateAttributes({ src: imageUrl, width: "100", height: null });
      }
    },
    [generateImage, updateAttributes]
  );

  const handleAlign = (alignment: "left" | "center" | "right") => {
    updateAttributes({ alignment });
  };

  const onResizeStart = (event: React.MouseEvent, handle: ResizeHandle) => {
    event.preventDefault();
    event.stopPropagation();

    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    if (containerRect.width === 0) return;

    const initialWidth = roundPercentageValue(
      (imageRect.width / containerRect.width) * 100
    );

    dragStateRef.current = {
      handle,
      startX: event.clientX,
      containerWidth: containerRect.width,
      initialWidth,
      alignment,
    };
    dragWidthRef.current = initialWidth;
    setDragWidth(initialWidth);
    setIsDragging(true);
    setIsFocused(true);
  };

  return (
    <NodeViewWrapper
      ref={containerRef}
      data-type="image"
      className={cn(
        "relative group/image hover:outline outline-1 hover:outline-border rounded-md",
        hasFocus && "outline outline-border",
        isNodeSelected &&
          "outline outline-primary outline-2 hover:outline-primary",
        isDragging && "select-none"
      )}
    >
      <img
        ref={imageRef}
        src={attrs.src}
        alt={attrs.alt || ""}
        className={`block max-w-full h-auto ${getAlignmentClasses()}`}
        style={{
          width: currentWidth !== null ? `${currentWidth}%` : undefined,
          height: imageHeight,
        }}
        onLoad={updateHandleOffsets}
        onClick={() => {
          setIsFocused(true);
        }}
      />

      {isEditable && (
        <div
          className={cn(
            "absolute top-[-0.75em] left-[50%] -translate-x-[50%] opacity-0 group-hover/image:opacity-100",
            isToolbarVisible && "opacity-100"
          )}
          contentEditable={false}
        >
          <Popover open={isFocused} onOpenChange={(state) => setIsFocused(state)}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                data-image-toolbar-trigger
                className={cn(
                  "px-2 py-0.5 w-auto h-auto rounded-sm text-primary transition-none",
                  isNodeSelected &&
                    "bg-muted hover:bg-muted border-primary text-primary hover:text-primary outline-primary outline-2"
                )}
              >
                <Ellipsis className="size-4" strokeWidth={1.5} />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" sideOffset={5} className="w-auto p-0.5">
              <div className="flex items-center gap-1">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <SquarePen className="size-4" strokeWidth={1.5} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="max-w-screen-lg overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>{t("editImage")}</SheetTitle>
                      <SheetDescription>
                        {t("editImageDescription")}
                      </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-2 w-full pt-6">
                      <Tabs defaultValue="generate">
                        <TabsList className="w-full h-auto">
                          <TabsTrigger
                            className="w-full flex-col py-2 gap-1 items-center justify-center"
                            value="upload"
                          >
                            <Upload className="size-4" strokeWidth={1.5} />
                            <span className="text-xs">{t("upload")}</span>
                          </TabsTrigger>
                          <TabsTrigger
                            className="w-full flex-col py-2 gap-1 items-center justify-center"
                            value="generate"
                          >
                            <Sparkles className="size-4" strokeWidth={1.5} />
                            <span className="text-xs">{t("generate")}</span>
                          </TabsTrigger>
                          <TabsTrigger
                            className="w-full flex-col py-2 gap-1 items-center justify-center"
                            value="search"
                          >
                            <Search className="size-4" strokeWidth={1.5} />
                            <span className="text-xs">{t("search")}</span>
                          </TabsTrigger>
                          <TabsTrigger
                            className="w-full flex-col py-2 gap-1 items-center justify-center"
                            value="icons"
                          >
                            <Cat className="size-4" strokeWidth={1.5} />
                            <span className="text-xs">{t("icons")}</span>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="upload">
                          <UploadImageForm
                            imageUrl={attrs.src}
                            onSubmit={(value) => updateAttributes({ src: value })}
                            onReset={() => updateAttributes({ src: "" })}
                          />

                          {theme?.assets?.imageUrl && (
                            <div className="mt-6 flex flex-col gap-6">
                              <div className="flex flex-col gap-0">
                                <h4 className="font-semibold text-lg tracking-tight">
                                  {t("themeImages")}
                                </h4>
                                <p className="text-sm text-neutral-500">
                                  {t("themeImagesDescription")}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {theme.assets.imageUrl.map((url) => (
                                  <div
                                    key={url}
                                    className="cursor-pointer aspect-video bg-muted rounded-lg border border-border"
                                    onClick={() => {
                                      updateAttributes({ src: url });
                                    }}
                                  >
                                    <img src={url} alt="theme image" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="generate">
                          <EditImageForm
                            currentSlide={{
                              id: node.attrs.id,
                              layoutImageUrl: attrs.src,
                              content: "",
                            }}
                            onSubmit={(value) => updateAttributes({ src: value })}
                            onReset={() => updateAttributes({ src: "" })}
                            onGenerate={handleGenerateImage}
                            isGenerating={isGenerating}
                          />
                        </TabsContent>

                        <TabsContent value="search">
                          <SearchImages
                            onImageSelect={(value) =>
                              updateAttributes({ src: value })
                            }
                          />
                        </TabsContent>
                        <TabsContent value="icons">
                          <SearchNounIcons
                            onIconSelect={(value) =>
                              updateAttributes({ src: value })
                            }
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </SheetContent>
                </Sheet>

                <Separator orientation="vertical" className="h-4" />

                {alignmentOptions.map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    variant="ghost"
                    size="icon"
                    data-image-align={value}
                    onClick={() => handleAlign(value)}
                    className={cn({
                      "bg-gray-100 hover:bg-gray-100": alignment === value,
                    })}
                  >
                    <Icon className="size-4" strokeWidth={1.5} />
                  </Button>
                ))}

                <Separator orientation="vertical" className="h-4" />

                <Select
                  value={selectWidthValue}
                  onValueChange={(value) =>
                    updateAttributes({ width: value, height: null })
                  }
                >
                  <SelectTrigger className="w-[90px] text-left h-8 focus:ring-0 border-none shadow-none ring-offset-0 hover:bg-muted">
                    <SelectValue placeholder={`${selectWidthValue}%`} />
                  </SelectTrigger>
                  <SelectContent>
                    {customWidthOption && (
                      <SelectItem value={customWidthOption}>
                        {customWidthOption}%
                      </SelectItem>
                    )}
                    {IMAGE_WIDTH_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Separator orientation="vertical" className="h-4" />

                <Button variant="ghost" size="icon" onClick={deleteNode}>
                  <Trash2 className="size-4" strokeWidth={1.5} />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {isEditable && (
        <div
          contentEditable={false}
          draggable
          data-drag-handle
          className={cn("absolute top-0 left-0 -translate-x-full opacity-0 group-hover/image:opacity-100 bg-background rounded-sm border border-border cursor-grab active:cursor-grabbing px-0.5 py-1.5 -ml-2", hasFocus && "opacity-100")}
        >
          <GripVertical className="size-4" strokeWidth={1} />
        </div>
      )}

      {isEditable && handleOffsets.left !== null && handleOffsets.right !== null && (
        <div
          className="absolute inset-0 pointer-events-none"
          contentEditable={false}
        >
          {resizeHandles.map((handle) => {
            const offset =
              handle === "left" ? handleOffsets.left : handleOffsets.right;

            if (offset === null) {
              return null;
            }

            return (
              <div
                key={handle}
                data-image-resize-handle={handle}
                className="absolute top-0 h-full pointer-events-auto cursor-col-resize"
                style={{
                  left: `${offset}px`,
                  width: "24px",
                  transform: "translateX(-50%)",
                }}
                onMouseDown={(event) => onResizeStart(event, handle)}
              >
                <div
                  className={cn(
                    "h-full mx-auto rounded-full transition-all",
                    isDragging && dragStateRef.current?.handle === handle
                      ? "w-[3px] bg-primary"
                      : cn("w-px bg-transparent group-hover/image:bg-border hover:!w-[3px] hover:!bg-primary/50", hasFocus && "bg-border")
                  )}
                />
              </div>
            );
          })}
        </div>
      )}
    </NodeViewWrapper>
  );
};

export default ImageNodeView;
