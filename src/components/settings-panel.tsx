import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";
import { useSettingsOpenAtom } from "@/lib/hooks/use-settings-open";
import { useScopedI18n } from "@/lib/locales/client";
import type { FontSizePreset } from "@/types";

const PRESETS: FontSizePreset[] = ["S", "M", "L"];

const SettingsPanel = () => {
  const t = useScopedI18n("editor");
  const [isOpen, setIsOpen] = useSettingsOpenAtom();
  const [presentation, setPresentation] = usePresentationAtom();
  const currentPreset = presentation.fontSizePreset ?? "M";

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="overflow-y-auto !duration-0 !transition-none">
        <SheetHeader>
          <SheetTitle>{t("settings")}</SheetTitle>
          <SheetDescription>{t("settingsDescription")}</SheetDescription>
        </SheetHeader>

        <div className="pt-6 flex items-center justify-between">
          <label className="text-sm font-normal">
            {t("fontSize")}
          </label>
          <ToggleGroup
            type="single"
            value={currentPreset}
            variant="outline"
            className="gap-0 rounded-lg border-border border overflow-hidden"
            onValueChange={(value) => {
              if (value) {
                setPresentation({
                  ...presentation,
                  fontSizePreset: value as FontSizePreset,
                });
              }
            }}
          >
            {PRESETS.map((preset) => (
              <ToggleGroupItem
                key={preset}
                value={preset}
                className="p-0 px-3 font-normal data-[state=on]:bg-muted -ml-px rounded-none border-none"
              >
                {preset}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsPanel;
