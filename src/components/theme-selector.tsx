
import ThemeThumb from "@/components/theme-thumb";
import { useScopedI18n } from "@/lib/locales/client";
import { useThemes } from "@/lib/hooks/use-themes";
import { Presentation } from "@/types";

type ThemeSelectorProps = {
  presentation: Presentation;
  setPresentation: (presentation: Presentation) => void;
};

export function ThemeSelector({
  presentation,
  setPresentation,
}: ThemeSelectorProps) {
  const t = useScopedI18n("generate");
  const { themes, isLoading, error } = useThemes();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 bg-background rounded-lg p-4 mx-auto max-w-2xl w-full">
        <h4 className="text-sm text-muted-foreground">{t("theme")}</h4>
        <div className="grid grid-cols-3 gap-4 pt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-3 bg-background rounded-lg p-4 mx-auto max-w-2xl w-full">
        <h4 className="text-sm text-muted-foreground">{t("theme")}</h4>
        <div className="text-sm text-destructive">
          Failed to load themes: {error?.message || "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 bg-background rounded-lg p-4 mx-auto max-w-2xl w-full">
      <h4 className="text-sm text-muted-foreground">{t("theme")}</h4>

      <div className="grid grid-cols-3 gap-4 pt-6">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() =>
              setPresentation({ ...presentation, themeId: theme.id })
            }
            className="text-left"
          >
            <ThemeThumb
              theme={theme}
              isSelected={presentation.themeId === theme.id}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
