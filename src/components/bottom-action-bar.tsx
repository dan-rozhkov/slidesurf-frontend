
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/lib/locales/client";
import { Sparkles } from "lucide-react";

type BottomActionBarProps = {
  isGenerating: boolean;
  sectionsLength: number;
  onMoveToEditor: () => void;
  getSlideCopy: (num: number) => string;
};

export function BottomActionBar({
  isGenerating,
  sectionsLength,
  onMoveToEditor,
  getSlideCopy,
}: BottomActionBarProps) {
  const t = useScopedI18n("generate");

  return (
    <div className="fixed bottom-0 left-0 w-full bg-background p-4 border-t border-border shadow-[0_-1px_15px_0_rgba(0,0,0,0.05)]">
      <div className="mx-auto max-w-2xl w-full flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {getSlideCopy(sectionsLength)}
        </span>

        <Button type="button" disabled={isGenerating} onClick={onMoveToEditor}>
          <Sparkles className="size-4" strokeWidth={1.5} />
          <span>{t("generatePresentation")}</span>
        </Button>
      </div>
    </div>
  );
}
