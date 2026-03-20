
import { SlidePlaceholder as SlidePlaceholderType } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { SlidesTemplates } from "@/types";
import { forwardRef, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, X } from "lucide-react";
import { useI18n, useCurrentLocale } from "@/lib/locales/client";

type SlidePlaceholderFormData = {
  content: string;
  template: SlidesTemplates | "auto";
  lang: "ru" | "en";
};

export const SlidePlaceholder = forwardRef<
  HTMLDivElement,
  Pick<SlidePlaceholderType, "id" | "afterSlideId"> & {
    onCancel: () => void;
    onGenerate: (content: string, template: SlidesTemplates) => void;
  }
>(({ id, onCancel, onGenerate }, ref) => {
  const t = useI18n();
  const locale = useCurrentLocale();

  const { register, handleSubmit, setValue, watch } =
    useForm<SlidePlaceholderFormData>({
      defaultValues: {
        content: "",
        template: "auto",
        lang: (locale as "ru" | "en") ?? "ru",
      },
    });

  const watchedContent = watch("content");
  const watchedTemplate = watch("template");
  const watchedLang = watch("lang");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);

    await handleGenerateSlide();

    setIsLoading(false);
  };

  useEffect(() => {
    if (ref && "current" in ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [ref]);

  const handleGenerateSlide = async () => {
    const response = await fetch("/api/generate/slide", {
      method: "POST",
      body: JSON.stringify({
        slideContent: watchedContent,
        template: watchedTemplate,
        lang: watchedLang,
      }),
    });

    const { content, template } = await response.json();
    onGenerate(content, template);
  };

  return (
    <div
      ref={ref}
      id={`slide-placeholder-${id}`}
      className="flex flex-col rounded-lg shadow-lg border border-border mt-10 mb-6 p-12 bg-muted relative"
      style={{
        width: "60em",
        height: "33.75em",
        overflow: "hidden",
      }}
    >
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-border"
          onClick={() => onCancel?.()}
        >
          <X className="size-4" />
        </Button>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full gap-4"
      >
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h3 className="text-3xl font-semibold tracking-tight">
              {t("slidePlaceholder.title")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("slidePlaceholder.description")}
            </p>
          </div>

          <div className="flex justify-start gap-2">
            <Select
              onValueChange={(value) => setValue("lang", value as "ru" | "en")}
              value={watchedLang}
            >
              <SelectTrigger className="w-32 border-none rounded-full py-1">
                <SelectValue placeholder={t("slidePlaceholder.language")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ru">
                  {t("slidePlaceholder.russian")}
                </SelectItem>
                <SelectItem value="en">
                  {t("slidePlaceholder.english")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <Textarea
            {...register("content", {
              required: t("slidePlaceholder.errors.contentRequired"),
              minLength: {
                value: 10,
                message: t("slidePlaceholder.errors.minLength"),
              },
            })}
            autoFocus
            placeholder={t("slidePlaceholder.contentPlaceholder")}
            className="resize-none flex-1"
            value={watchedContent}
          />
        </div>

        <div className="space-y-2 shrink-0">
          <div className="overflow-x-auto">
            <ToggleGroup
              type="single"
              value={watchedTemplate}
              onValueChange={(value) =>
                value && setValue("template", value as SlidesTemplates | "auto")
              }
              className="flex gap-3 pb-2 min-w-max"
            >
              <ToggleGroupItem
                value="auto"
                className="flex flex-col items-center justify-start gap-1 p-2 h-auto cursor-pointer w-[9rem] h-[6.5rem] border border-transparent data-[state=on]:border-border hover:bg-border/50"
              >
                <img
                  src={`/templates/auto.png`}
                  alt="auto"
                  width={80}
                  height={45}
                  className="rounded border border-border bg-clip-border"
                />
                <span className="text-xs text-center text-muted-foreground font-normal">
                  {t("slidePlaceholder.auto")}
                </span>
              </ToggleGroupItem>
              {Object.values(SlidesTemplates)
                .slice(1)
                .reverse()
                .map((template) => (
                  <ToggleGroupItem
                    key={template}
                    value={template}
                    className="flex flex-col items-center justify-start gap-1 p-2 h-auto cursor-pointer w-[9rem] h-[6.5rem] border border-transparent data-[state=on]:border-border hover:bg-border/50"
                  >
                    <img
                      src={`/templates/${template}.png`}
                      alt={template}
                      width={80}
                      height={45}
                      className="rounded border"
                    />
                    <span className="text-xs text-center text-muted-foreground font-normal">
                      {t(
                        `editor.slideTemplates.${template}` as never as keyof typeof t
                      )}
                    </span>
                  </ToggleGroupItem>
                ))}
            </ToggleGroup>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" size="sm" disabled={isLoading}>
            {isLoading && <Loader className="animate-spin" />}
            {t("slidePlaceholder.generate")}
          </Button>
        </div>
      </form>
    </div>
  );
});

SlidePlaceholder.displayName = "SlidePlaceholder";
