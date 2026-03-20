import { Button } from "@/components/ui/button";
import { Plus, FileUp } from "lucide-react";
import { SoonBadge } from "@/components/soon-badge";
import { useScopedI18n } from "@/lib/locales/client";
import { useThemeEditorStore } from "./theme-editor-store";

export function ThemesPageActions() {
  const t = useScopedI18n("themes");
  const { openCreate } = useThemeEditorStore();

  return (
    <div className="flex gap-4">
      <Button className="font-semibold px-6" onClick={openCreate}>
        <Plus className="size-4 mr-2" strokeWidth={1.5} />
        {t("create")}
      </Button>

      <Button variant="outline" className="font-semibold px-6">
        <FileUp className="size-4 mr-2" strokeWidth={1.5} />
        {t("import")}
        <SoonBadge />
      </Button>
    </div>
  );
}
