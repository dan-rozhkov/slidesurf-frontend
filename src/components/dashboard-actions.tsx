import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, FileUp } from "lucide-react";
import { SoonBadge } from "@/components/soon-badge";
import { useScopedI18n } from "@/lib/locales/client";
import { CreateEmptyPresentationButton } from "@/components/create-empty-presentation-button";

export default function DashboardActions() {
  const t = useScopedI18n("dashboardActions");

  return (
    <>
      <Link to="/create">
        <Button className="font-semibold px-6">
          <Plus className="size-4 mr-2" strokeWidth={1.5} />
          {t("createPresentation")}
          <span className="text-xs text-accent px-1.5 py-0.5 bg-accent/20 rounded-md">
            AI
          </span>
        </Button>
      </Link>

      <CreateEmptyPresentationButton>
        {t("emptyPresentation")}
      </CreateEmptyPresentationButton>

      <Button variant="outline" className="font-semibold px-6">
        <FileUp className="size-4 mr-2" strokeWidth={1.5} />
        {t("import")}
        <SoonBadge className="font-normal" />
      </Button>
    </>
  );
}
