
import { Lightbulb, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/lib/locales/client";

export function SlideControlHint() {
  const t = useScopedI18n("generate");
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 w-72 z-50 hidden lg:block animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-border shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
            <div className="flex items-center justify-center size-10 shrink-0 bg-amber-500/10 rounded-full">
              <Lightbulb
                className="size-5 shrink-0 text-amber-500"
                strokeWidth={1.5}
              />
            </div>
            <span>{t("hint.title")}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 shrink-0 -mt-1 -mr-1"
            onClick={() => setIsVisible(false)}
          >
            <X className="size-4" strokeWidth={1.5} />
          </Button>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          {t("hint.description")}
        </p>
        <div className="text-sm">
          <p className="text-foreground mb-2">{t("hint.example")}</p>
          <div className="bg-muted rounded-lg p-3 space-y-2 text-xs text-muted-foreground">
            <p>{t("hint.exampleSlide1Title")}</p>
            <ul className="list-disc list-inside">
              <li>{t("hint.exampleKeyPoint")} 1</li>
              <li>{t("hint.exampleKeyPoint")} 2</li>
            </ul>
            <p className="font-bold text-foreground/70">---</p>
            <p>{t("hint.exampleSlide2Title")}</p>
            <ul className="list-disc list-inside">
              <li>{t("hint.exampleKeyPoint")} 1</li>
              <li>{t("hint.exampleKeyPoint")} 2</li>
            </ul>
            <p className="font-bold text-foreground/70">---</p>
            <p>{t("hint.exampleSlide3Title")}</p>
            <ul className="list-disc list-inside">
              <li>{t("hint.exampleKeyPoint")} 1</li>
              <li>...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
