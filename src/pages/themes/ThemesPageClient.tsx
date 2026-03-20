import { useThemes } from "@/lib/hooks/use-themes";
import ThemeThumb from "@/components/theme-thumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useScopedI18n } from "@/lib/locales/client";
import { ThemeEditor } from "@/components/theme-editor/index";
import { useThemeEditorStore } from "./theme-editor-store";
import { Theme } from "@/types";

export default function ThemesPageClient() {
  const {
    themes,
    userThemes,
    isLoading,
    error,
    createTheme,
    updateTheme,
    deleteTheme,
    refreshThemes,
  } = useThemes();
  const t = useScopedI18n("themes");
  const {
    isOpen: isThemeEditorOpen,
    mode,
    initialTheme,
    closeEditor,
    openEdit,
    openCopy,
  } = useThemeEditorStore();

  if (isLoading) {
    return (
      <div className="grid grid-cols-6 gap-4 mx-auto max-w-7xl px-4 py-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="aspect-video rounded-lg" />
            <Skeleton className="h-4 w-24 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-destructive" />
            <p className="text-sm">
              {t("errorLoading")}: {error?.message || t("unknownError")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveTheme = async (themeData: Theme): Promise<void> => {
    if (mode === "edit" && initialTheme?.id) {
      const updated = await updateTheme(initialTheme.id, themeData);
      if (updated) await refreshThemes();
      return;
    }
    const created = await createTheme(themeData);
    if (created) await refreshThemes();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-6 gap-4">
        {themes.map((theme) => (
          <ThemeThumb
            key={theme.id}
            theme={theme}
            isUserTheme={userThemes.some((ut) => ut.id === theme.id)}
            onEdit={(t) => openEdit(t)}
            onCopy={(t) => openCopy(t)}
            onDelete={async (t) => {
              await deleteTheme(t.id);
              await refreshThemes();
            }}
          />
        ))}
      </div>

      {themes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noThemesAvailable")}</p>
        </div>
      )}

      <ThemeEditor
        isOpen={isThemeEditorOpen}
        onOpenChange={closeEditor}
        theme={initialTheme || undefined}
        onSave={handleSaveTheme}
      />
    </div>
  );
}
