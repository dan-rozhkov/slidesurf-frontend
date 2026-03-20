
import { useState, useRef } from "react";
import { apiFetch } from "@/api/client";
import { Upload, X, Loader, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useScopedI18n } from "@/lib/locales/client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ThemeFormData } from "../types";

type ImageGridProps = {
  urls?: string[];
  type: "background" | "slide";
  title: string;
  inputRef: React.RefObject<HTMLInputElement>;
  isUploading: boolean;
  onFileSelect: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "background" | "slide"
  ) => void;
  onRemoveImage: (index: number, type: "background" | "slide") => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (...args: any[]) => string;
};

function ImageGrid({
  urls,
  type,
  title,
  inputRef,
  isUploading,
  onFileSelect,
  onRemoveImage,
  t,
}: ImageGridProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{title}</Label>
        <div className="relative">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            multiple
            onChange={(e) => onFileSelect(e, type)}
            className="absolute inset-0 size-0 opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            {isUploading ? (
              <>
                <Loader className="size-4 mr-2 animate-spin" />
                {t("uploading")}
              </>
            ) : (
              <>
                <Upload className="size-4 mr-2" />
                {t("addImages")}
              </>
            )}
          </Button>
        </div>
      </div>

      {urls && urls.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {urls.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-video bg-muted rounded-lg overflow-hidden border"
            >
              <img
                src={url}
                alt={`${title} ${index + 1}`}
                className="object-cover absolute inset-0 w-full h-full"
              />
              <Button
                size="icon"
                variant="outline"
                type="button"
                onClick={() => onRemoveImage(index, type)}
                className="absolute top-1 right-1 size-6 p-0 border-none"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 rounded-lg text-center bg-muted">
          <ImageIcon className="size-4 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {t("noImagesUploaded")}
          </p>
        </div>
      )}
    </div>
  );
}

type AssetsSectionProps = {
  currentValues: ThemeFormData;
  watch: () => ThemeFormData;
  onBackgroundImagesChange: (urls: string[]) => void;
  onSlideImagesChange: (urls: string[]) => void;
};

export function AssetsSection({
  currentValues,
  watch,
  onBackgroundImagesChange,
  onSlideImagesChange,
}: AssetsSectionProps) {
  const t = useScopedI18n("themes.editor");
  const [isUploading, setIsUploading] = useState<{
    background: boolean;
    slide: boolean;
  }>({
    background: false,
    slide: false,
  });

  const inputSlideImageRef = useRef<HTMLInputElement>(null);
  const inputBackgroundImageRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File, type: "background" | "slide") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await apiFetch("/api/themes/assets/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const { imageUrl } = await response.json();
      return imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "background" | "slide"
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const uploadPromises = files.map((file) => uploadImage(file, type));
      const uploadedUrls = await Promise.all(uploadPromises);

      const currentFormValues = watch();

      if (type === "background") {
        const newUrls = [
          ...(currentFormValues.backgroundImageUrls || []),
          ...uploadedUrls,
        ];
        onBackgroundImagesChange(newUrls);
      } else {
        const newUrls = [
          ...(currentFormValues.slideImageUrls || []),
          ...uploadedUrls,
        ];
        onSlideImagesChange(newUrls);
      }

      toast.success(
        `${files.length} ${
          files.length === 1 ? t("imageUploaded") : t("imagesUploaded")
        }`
      );

      // Reset input
      event.target.value = "";
    } catch (error) {
      toast.error(`${t("uploadError")} ${error}`);
    } finally {
      setIsUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const removeImage = async (index: number, type: "background" | "slide") => {
    const currentFormValues = watch();
    const urls =
      type === "background"
        ? currentFormValues.backgroundImageUrls
        : currentFormValues.slideImageUrls;

    if (!urls || !urls[index]) return;

    const imageUrl = urls[index];

    try {
      // Delete from S3
      const response = await apiFetch(
        `/api/themes/assets/delete?url=${encodeURIComponent(imageUrl)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      // Remove from local state
      if (type === "background") {
        const newUrls = currentFormValues.backgroundImageUrls?.filter(
          (_, i) => i !== index
        );

        onBackgroundImagesChange(newUrls || []);
      } else {
        const newUrls = currentFormValues.slideImageUrls?.filter(
          (_, i) => i !== index
        );

        onSlideImagesChange(newUrls || []);
      }

      toast.success(t("imageDeleted"));
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error(t("deleteImageError"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-medium">{t("assetsTitle")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("assetsDescription")}
        </p>
      </div>

      <ImageGrid
        urls={currentValues.backgroundImageUrls}
        type="background"
        title={t("backgroundImages")}
        inputRef={inputBackgroundImageRef}
        isUploading={isUploading.background}
        onFileSelect={handleFileSelect}
        onRemoveImage={removeImage}
        t={t}
      />

      <ImageGrid
        urls={currentValues.slideImageUrls}
        type="slide"
        title={t("slideImages")}
        inputRef={inputSlideImageRef}
        isUploading={isUploading.slide}
        onFileSelect={handleFileSelect}
        onRemoveImage={removeImage}
        t={t}
      />

      <div className="text-xs text-muted-foreground space-y-1">
        <p>{t("supportedFormats")}</p>
        <p>{t("maxFileSize")}</p>
        <p>{t("multipleFiles")}</p>
      </div>
    </div>
  );
}
