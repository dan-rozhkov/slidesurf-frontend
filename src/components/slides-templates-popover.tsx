
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlidesTemplates } from "@/types";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/locales/client";

export const SlidesTemplatesPopover = ({
  onTemplateSelect,
}: {
  onTemplateSelect: (template: SlidesTemplates) => void;
}) => {
  const [open, setOpen] = useState(false);
  const t = useI18n();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-l-none rounded-r-lg"
        >
          <ChevronDown className="size-4" strokeWidth={1.5} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        className="w-[420px] max-h-[420px] overflow-y-auto"
      >
        <p className="text-sm text-neutral-500 mb-3">
          {t("editor.chooseTemplate")}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(SlidesTemplates)
            .filter(
              ([, value]) =>
                ![
                  SlidesTemplates.TOC_SLIDE,
                  SlidesTemplates.CHAPTER_DIVIDER,
                  SlidesTemplates.DATA_WITH_CHART,
                  SlidesTemplates.CONCLUSION_SLIDE,
                  SlidesTemplates.CONTENT_WITH_INSIGHT,
                  SlidesTemplates.KPI_CARDS,
                ].includes(value as SlidesTemplates),
            )
            .map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col gap-2 rounded-lg border border-border overflow-hidden p-1 pb-2 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => {
                onTemplateSelect(value as SlidesTemplates);
                setOpen(false);
              }}
            >
              <img
                src={`/templates/${value}.png`}
                alt={value}
                width={120}
                height={67.2}
              />

              <span className="text-center px-2 text-xs text-primary/80 text-balance">
                {t(`editor.slideTemplates.${value}` as never as keyof typeof t)}
              </span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
