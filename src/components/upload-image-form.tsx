/* eslint-disable @next/next/no-img-element */

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Trash2 } from "lucide-react";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { Upload } from "lucide-react";
import { useScopedI18n } from "@/lib/locales/client";

export default function UploadImageForm({
  onSubmit,
  onReset,
  imageUrl,
}: {
  onSubmit: (url: string) => void;
  onReset: () => void;
  imageUrl: string;
}) {
  const [presentationAtom] = usePresentationAtom();
  const [, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useScopedI18n("editor");

  return (
    <div className="space-y-4">
      <form className="space-y-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const selectedFile = e.target.files?.[0] || null;
            setFile(selectedFile);
            e.target.value = "";

            if (selectedFile) {
              setUploading(true);
              try {
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("presentationId", presentationAtom.id);

                const response = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });

                const data = await response.json();

                if (data.success) {
                  onSubmit(data.url);
                }
              } catch (error) {
                console.error("Upload failed:", error);
              } finally {
                setUploading(false);
              }
            }
          }}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={uploading}
          onClick={(e) => {
            e.preventDefault();
            fileInputRef.current?.click();
          }}
        >
          {uploading ? (
            <Loader className="w-4 h-4 animate-spin" strokeWidth={1.5} />
          ) : (
            <Upload className="w-4 h-4" strokeWidth={1.5} />
          )}
          <span>{t("upload")}</span>
        </Button>

        <span className="text-xs text-muted-foreground flex">
          {t("supportedFormats")}
        </span>
      </form>

      {imageUrl && (
        <div className="aspect-square max-w-[100px] rounded-lg overflow-hidden border border-border relative">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />

          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 size-6 p-0"
            onClick={onReset}
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      )}
    </div>
  );
}
