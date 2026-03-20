
import { useCurrentSlideIdAtom } from "@/lib/hooks/use-current-slide-id";
import { useSheetVisibility } from "@/lib/hooks/use-sheet-visibility";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";
import { EditImageForm } from "./edit-image-form";
import { useImageGeneration } from "@/lib/hooks/use-image-generation";
import { SearchImages } from "./search-images";
import { Slide } from "@/types";
import UploadImageForm from "./upload-image-form";
import { Search, Sparkles, Upload } from "lucide-react";
import { useScopedI18n } from "@/lib/locales/client";
import { useTheme } from "@/lib/hooks/use-theme";

export const EditImageSheet = () => {
  const [presentationAtom, setPresentationAtom] = usePresentationAtom();
  const [currentSlideId] = useCurrentSlideIdAtom();
  const [sheetVisibility, setSheetVisibility, context] = useSheetVisibility();
  const { isGenerating, generateImage } = useImageGeneration();
  const t = useScopedI18n("editor");
  const { theme } = useTheme(presentationAtom?.themeId || null);

  const isCellMode = context.mode === "cell";

  const currentSlide = useMemo(
    () => presentationAtom.slides.find((slide) => slide.id === currentSlideId),
    [presentationAtom.slides, currentSlideId]
  );

  // Get current image URL based on mode
  const currentImageUrl = isCellMode
    ? context.imageUrl
    : currentSlide?.layoutImageUrl;

  const updateImage = (url: string) => {
    if (isCellMode && context.onImageChange) {
      context.onImageChange(url);
    } else {
      setPresentationAtom({
        ...presentationAtom,
        slides: presentationAtom.slides.map((slide) =>
          slide.id === currentSlideId ? { ...slide, layoutImageUrl: url } : slide
        ),
      });
    }
  };

  const resetImage = () => {
    if (isCellMode && context.onImageReset) {
      context.onImageReset();
    } else {
      setPresentationAtom({
        ...presentationAtom,
        slides: presentationAtom.slides.map((slide) =>
          slide.id === currentSlideId
            ? { ...slide, layoutImageUrl: undefined }
            : slide
        ),
      });
    }
  };

  const handleGenerateImage = async (prompt: string, model: string) => {
    const imageUrl = await generateImage(prompt, model);

    if (imageUrl) {
      updateImage(imageUrl);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setSheetVisibility(isOpen);
  };

  // Get title and description based on mode
  const sheetTitle = isCellMode ? t("cellBackgroundImage") : t("editImage");
  const sheetDescription = isCellMode
    ? t("cellBackgroundImageDescription")
    : t("editImageDescription");

  return (
    <Sheet open={sheetVisibility} onOpenChange={handleOpenChange}>
      <SheetContent className="max-w-screen-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>

        <div className="space-y-2 w-full pt-6">
          <Tabs defaultValue={isCellMode ? "upload" : "generate"}>
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
                value="generate"
              >
                <Sparkles className="w-4 h-4 mr-2" strokeWidth={1.5} />
                <span className="text-xs">{t("generate")}</span>
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
                imageUrl={currentImageUrl as string}
                onSubmit={updateImage}
                onReset={resetImage}
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
                          updateImage(url);
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
                currentSlide={currentSlide as Slide}
                onSubmit={updateImage}
                onReset={resetImage}
                onGenerate={handleGenerateImage}
                isGenerating={isGenerating}
                imageUrl={isCellMode ? currentImageUrl : undefined}
              />
            </TabsContent>

            <TabsContent value="search">
              <SearchImages onImageSelect={updateImage} />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
