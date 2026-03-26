
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import {
  Settings2,
  ArrowUpToLine,
  ArrowDownToLine,
  FoldVertical,
  RotateCcw,
} from "lucide-react";
import { Slide, SlideLayout, SlideVerticalAlign } from "@/types";
import { useSlideActions } from "@/lib/actions/slide.client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useScopedI18n } from "@/lib/locales/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Search, SquarePen } from "lucide-react";
import UploadImageForm from "./upload-image-form";
import { SearchImages } from "./search-images";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { useTheme } from "@/lib/hooks/use-theme";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function SlideSettingsPopover({
  slide,
  onSlideUpdate,
}: {
  slide: Slide;
  onSlideUpdate: (field: keyof Slide, value: string | undefined) => void;
}) {
  const t = useScopedI18n("editor");
  const [presentation] = usePresentationAtom();
  const { theme } = useTheme(presentation?.themeId || null);
  const { updateSlideImageWidth } = useSlideActions();

  const isSideImage =
    slide.layout === SlideLayout.LEFT_IMAGE ||
    slide.layout === SlideLayout.RIGHT_IMAGE;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 w-auto h-auto relative"
        >
          <Tooltip delayDuration={300}>
            <TooltipTrigger className="absolute top-0 left-0 w-full h-full"></TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              {t("slideSettings")}
            </TooltipContent>
          </Tooltip>
          <Settings2 className="size-4" strokeWidth={1.5} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[360px] flex flex-col gap-6"
        align="center"
        sideOffset={12}
      >
        <div className="grid grid-cols-2 gap-2 items-center">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-neutral-500">{t("contentAlignment")}</p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <ToggleGroup
              type="single"
              defaultValue={slide.verticalAlign ?? SlideVerticalAlign.CENTER}
              variant="outline"
              className="gap-0 justify-start rounded-lg border-border border overflow-hidden"
              onValueChange={(value) => {
                onSlideUpdate("verticalAlign", value as SlideVerticalAlign);
              }}
            >
              {Object.values(SlideVerticalAlign).map((align) => (
                <ToggleGroupItem
                  key={align}
                  value={align}
                  className="p-0 px-3 data-[state=on]:bg-muted -ml-px rounded-none border-none"
                >
                  {align === SlideVerticalAlign.TOP && (
                    <ArrowUpToLine strokeWidth={1.5} />
                  )}
                  {align === SlideVerticalAlign.CENTER && (
                    <FoldVertical strokeWidth={1.5} />
                  )}
                  {align === SlideVerticalAlign.BOTTOM && (
                    <ArrowDownToLine strokeWidth={1.5} />
                  )}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 items-center">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-neutral-500">{t("backgroundImage")}</p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
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
                        className="w-full flex-col py-2 gap-1"
                        value="upload"
                      >
                        <Upload className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        <span className="text-xs">{t("upload")}</span>
                      </TabsTrigger>
                      <TabsTrigger
                        className="w-full flex-col py-2 gap-1"
                        value="search"
                      >
                        <Search className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        <span className="text-xs">{t("search")}</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload">
                      <UploadImageForm
                        imageUrl={slide?.backgroundImageUrl ?? ""}
                        onSubmit={(url) => {
                          onSlideUpdate("backgroundImageUrl", url);
                        }}
                        onReset={() => {
                          onSlideUpdate("backgroundImageUrl", undefined);
                        }}
                      />

                      {theme?.assets?.backgroundImageUrl && (
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
                            {theme?.assets?.backgroundImageUrl.map((url) => (
                              <div
                                key={url}
                                className="cursor-pointer aspect-video bg-muted rounded-lg border border-border"
                                onClick={() => {
                                  onSlideUpdate("backgroundImageUrl", url);
                                }}
                              >
                                <img
                                  src={url}
                                  alt="background"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="search">
                      <SearchImages
                        onImageSelect={(value) => {
                          onSlideUpdate("backgroundImageUrl", value);
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {isSideImage && slide.layoutImageWidth != null && (
          <div className="grid grid-cols-2 gap-2 items-center">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-neutral-500">Ширина изображения</p>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => updateSlideImageWidth(slide.id, 35)}
              >
                <RotateCcw className="size-3.5" strokeWidth={1.5} />
                Сбросить
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
