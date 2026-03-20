
import { apiFetch } from "@/api/client";
import { Button } from "@/components/ui/button";
import { SimpleTiptapEditor } from "@/components/ui/simple-tiptap-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WithTooltip } from "@/components/ui/with-tooltip";
import { Attachment } from "@/components/attachment";
import { Attachment as AttachmentType } from "@/types";
import { Globe, Loader, Paperclip, Repeat } from "lucide-react";
import { UseFormReturn, Controller } from "react-hook-form";
import { useRef, useCallback } from "react";
import { toast } from "sonner";
import { useScopedI18n } from "@/lib/locales/client";
import { AVAILABLE_MODELS } from "@/lib/models";
import { Badge } from "@/components/ui/badge";
import type { ActiveSubscription } from "@/types";
import { SUBSCRIPTION_LIMITS } from "@/lib/subscription-limits";
import { isSubscriptionEnabled } from "@/lib/subscription-utils";

type FormData = {
  title: string;
  slidesCount: number;
  lang: "ru" | "en";
  model: string;
  tone?: "formal" | "informal" | "neutral";
  whom?: "all" | "boss" | "colleagues" | "clients";
  contentStyle?: "more" | "less" | "as-is";
  useResearch?: boolean;
};

type PresentationFormProps = {
  form: UseFormReturn<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  isGenerating: boolean;
  alreadyGenerated: boolean;
  attachments: AttachmentType[];
  setAttachments: (
    attachments:
      | AttachmentType[]
      | ((prev: AttachmentType[]) => AttachmentType[])
  ) => void;
  isUploading: boolean;
  getSlideCopy: (num: number) => string;
  subscription?: ActiveSubscription | null;
};

// Helper function to convert HTML to plain text
const htmlToText = (html: string): string => {
  if (!html) return "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

export function PresentationForm({
  form,
  onSubmit,
  isGenerating,
  alreadyGenerated,
  attachments,
  setAttachments,
  isUploading,
  getSlideCopy,
  subscription,
}: PresentationFormProps) {
  const t = useScopedI18n("generate");

  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await apiFetch("/api/attachment/add", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Ошибка при загрузке файла");
        }

        const { url } = await response.json();

        setAttachments((prevAttachments: AttachmentType[]) =>
          prevAttachments.map((attachment: AttachmentType) =>
            !attachment.url ? { ...attachment, url } : attachment
          )
        );
        toast.success("Файл успешно загружен");
      } catch (error) {
        console.error(error);
        toast.error("Ошибка при загрузке файла");
        setAttachments([]);
      }
    },
    [setAttachments]
  );

  const slidesCount = form.watch("slidesCount");
  const lang = form.watch("lang");
  const model = form.watch("model");
  const useResearch = form.watch("useResearch");

  const getModelDisplayName = (modelId: string) => {
    return AVAILABLE_MODELS.find((model) => model.id === modelId)?.name;
  };

  const getSlideCountBadge = (slideCount: number) => {
    if (!isSubscriptionEnabled()) return null;
    if (!subscription) return null;
    // No badge for Auto mode
    if (slideCount === -1) return null;

    const currentPlan = subscription.planType;
    const maxSlidesForFree = SUBSCRIPTION_LIMITS.free.maxSlidesPerGeneration;
    const maxSlidesForPlus = SUBSCRIPTION_LIMITS.plus.maxSlidesPerGeneration;

    if (slideCount > maxSlidesForFree && currentPlan === "free") {
      return slideCount <= maxSlidesForPlus ? "plus" : "pro";
    }

    if (slideCount > maxSlidesForPlus && currentPlan === "plus") {
      return "pro";
    }

    return null;
  };

  const getSlideCountLabel = (count: number) => {
    if (count === -1) return `${t("slidesPrefix")} ${t("auto")}`;
    return `${t("slidesPrefix")} ${count}`;
  };

  const getModelBadge = (modelId: string) => {
    if (!isSubscriptionEnabled()) return null;
    if (!subscription) return null;

    const model = AVAILABLE_MODELS.find((model) => model.id === modelId);
    if (!model?.advanced) return null;

    const currentPlan = subscription.planType;
    if (currentPlan === "free") {
      return "plus";
    }

    return null;
  };

  const handleSubmit = async (data: FormData) => {
    // Convert HTML title to plain text before submission
    const textTitle = htmlToText(data.title);
    await onSubmit({ ...data, title: textTitle });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-4 max-w-2xl w-full mx-auto">
        <div>
          {attachments.map((attachment) => (
            <Attachment
              key={attachment.name}
              onDeleteAttachment={() =>
                setAttachments((prevAttachments: AttachmentType[]) =>
                  prevAttachments.filter(
                    (att: AttachmentType) => att.name !== attachment.name
                  )
                )
              }
              attachment={attachment}
              isUploading={isUploading}
            />
          ))}
        </div>

        <div className="relative w-full">
          <Controller
            name="title"
            control={form.control}
            render={({ field }) => (
              <SimpleTiptapEditor
                defaultValue={field.value}
                onChange={field.onChange}
                placeholder={t("placeholder")}
                autoFocus
                className="w-full shadow-sm !text-[16px] p-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.shiftKey) {
                    e.preventDefault();
                    form.handleSubmit(handleSubmit)();
                  }
                }}
              />
            )}
          />

          <input
            className="w-0 h-0 hidden"
            type="file"
            ref={attachmentInputRef}
            accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, text/csv, text/html"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];

              if (file) {
                setAttachments([
                  {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                  },
                ]);
                uploadFile(file);
              }
            }}
          />

          <div className="absolute right-2 top-2 flex items-center gap-2">
            <WithTooltip
              trigger={
                <Button
                  type="button"
                  variant={useResearch ? "secondary" : "ghost"}
                  size="icon-sm"
                  aria-pressed={useResearch}
                  onClick={() => form.setValue("useResearch", !useResearch)}
                >
                  <Globe className="size-4" strokeWidth={1.5} />
                </Button>
              }
              display={t("webSearch")}
              side="top"
            />

            <WithTooltip
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => attachmentInputRef.current?.click()}
                >
                  <Paperclip className="size-4" strokeWidth={1.5} />
                </Button>
              }
              display={t("uploadFile")}
              side="top"
            />

            {alreadyGenerated && (
              <WithTooltip
                trigger={
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader
                        className="size-4 animate-spin"
                        strokeWidth={1.5}
                      />
                    ) : (
                      <Repeat className="size-4" strokeWidth={1.5} />
                    )}
                  </Button>
                }
                display={t("regenerate")}
                side="top"
              />
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Select
              onValueChange={(value) =>
                form.setValue("slidesCount", Number(value))
              }
              value={slidesCount.toString()}
            >
              <SelectTrigger className="border-none rounded-full bg-accent py-1 shrink-0 w-auto">
                <SelectValue placeholder={t("auto")}>
                  {getSlideCountLabel(slidesCount)}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {/* Auto option */}
                <SelectItem value="-1">
                  <span className="white-space text-nowrap truncate">
                    {t("auto")}
                  </span>
                </SelectItem>
                {/* Numeric options */}
                {[
                  ...Array.from({ length: 10 }, (_, i) => i + 1),
                  15,
                  20,
                  30,
                  40,
                  50,
                  60,
                ].map((slideCount) => {
                  const badge = getSlideCountBadge(slideCount);

                  return (
                    <SelectItem key={slideCount} value={slideCount.toString()}>
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="white-space text-nowrap truncate">
                          {getSlideCopy(slideCount)}
                        </span>
                        {badge && (
                          <Badge variant="secondary" className="text-xs">
                            {t(badge) as unknown as never}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => form.setValue("model", value)}
              value={model}
            >
              <SelectTrigger className="max-w-40 border-none rounded-full bg-accent py-1">
                <SelectValue placeholder={t("selectModel")} />
              </SelectTrigger>

              <SelectContent>
                {AVAILABLE_MODELS.map((modelOption) => {
                  const badge = getModelBadge(modelOption.id);

                  return (
                    <SelectItem key={modelOption.id} value={modelOption.id}>
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="white-space text-nowrap truncate">
                          {getModelDisplayName(modelOption.id)}
                        </span>
                        {badge && (
                          <Badge variant="secondary" className="text-xs">
                            {t(badge) as unknown as never}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                form.setValue("lang", value as "ru" | "en")
              }
              value={lang}
            >
              <SelectTrigger className="border-none rounded-full bg-accent py-1">
                <SelectValue placeholder="Язык" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!alreadyGenerated && (
            <Button type="submit" disabled={isGenerating}>
              {isGenerating && <Loader className="size-4 animate-spin" />}
              {t("generatePlan")}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
