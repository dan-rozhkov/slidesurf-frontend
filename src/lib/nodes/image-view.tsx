/* eslint-disable @next/next/no-img-element */

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
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
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

const ImageNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
}) => {
  const t = useScopedI18n("editor");
  const { isGenerating, generateImage } = useImageGeneration();
  const [isFocused, setIsFocused] = useState(false);
  const attrs = node.attrs as ImageAttributes;
  const [presentationAtom] = usePresentationAtom();
  const { theme } = useTheme(presentationAtom?.themeId || null);

  const getAlignmentClasses = () => {
    switch (attrs.alignment) {
      case "left":
        return "mr-auto";
      case "right":
        return "ml-auto";
      default:
        return "mx-auto";
    }
  };

  const handleGenerateImage = useCallback(
    async (prompt: string) => {
      const imageUrl = await generateImage(prompt);

      if (imageUrl) {
        updateAttributes({ src: imageUrl, width: 100 });
      }
    },
    [generateImage, updateAttributes]
  );

  const handleAlign = (alignment: "left" | "center" | "right") => {
    updateAttributes({ alignment });
  };

  return (
    <NodeViewWrapper
      data-type="image"
      className={cn(
        "relative group/image hover:outline outline-1 hover:outline-border rounded-md",
        isFocused && "outline outline-primary outline-2 hover:outline-primary"
      )}
    >
      <img
        src={attrs.src}
        alt={attrs.alt || ""}
        className={`block max-w-full h-auto ${getAlignmentClasses()}`}
        style={{
          width: attrs.width ? `${attrs.width}%` : undefined,
          height: attrs.height ? `${attrs.height}%` : undefined,
        }}
        onClick={() => {
          setIsFocused(true);
        }}
      />

      <div
        className={cn(
          "absolute top-[-0.75em] left-[50%] -translate-x-[50%] opacity-0 group-hover/image:opacity-100",
          isFocused && "opacity-100"
        )}
      >
        <Popover open={isFocused} onOpenChange={(state) => setIsFocused(state)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "px-2 py-0.5 w-auto h-auto rounded-sm text-primary transition-none",
                isFocused &&
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
                              {theme?.assets?.imageUrl.map((url) => (
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
                          // @TODO: Fix this fast solution
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
                    </Tabs>{" "}
                  </div>
                </SheetContent>
              </Sheet>

              <Separator orientation="vertical" className="h-4" />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAlign("left")}
                className={cn({
                  "bg-gray-100 hover:bg-gray-100": attrs.alignment === "left",
                })}
              >
                <AlignLeft className="size-4" strokeWidth={1.5} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAlign("center")}
                className={cn({
                  "bg-gray-100 hover:bg-gray-100": attrs.alignment === "center",
                })}
              >
                <AlignCenter className="size-4" strokeWidth={1.5} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAlign("right")}
                className={cn({
                  "bg-gray-100 hover:bg-gray-100": attrs.alignment === "right",
                })}
              >
                <AlignRight className="size-4" strokeWidth={1.5} />
              </Button>

              <Separator orientation="vertical" className="h-4" />

              <Select
                value={attrs.width?.toString() ?? "100"}
                onValueChange={(value) => updateAttributes({ width: value })}
              >
                <SelectTrigger className="w-[90px] text-left h-8 focus:ring-0 border-none shadow-none ring-offset-0 hover:bg-muted">
                  <SelectValue placeholder={t("width")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="15">15%</SelectItem>
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="60">60%</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
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

      <div
        contentEditable={false}
        draggable
        data-drag-handle
        className="absolute top-0 left-0 -translate-x-full opacity-0 group-hover/image:opacity-100 bg-background rounded-sm border border-border cursor-grab active:cursor-grabbing px-0.5 py-1.5 -ml-2"
      >
        <GripVertical className="size-4" strokeWidth={1} />
      </div>
    </NodeViewWrapper>
  );
};

export default ImageNodeView;
