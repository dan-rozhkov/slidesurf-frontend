import { useScopedI18n } from "@/lib/locales/client";
import { CreateTeamDialog } from "@/components/teams";
import { TeamList } from "@/components/teams";

export default function TeamsPage() {
  const t = useScopedI18n("teams");

  return (
    <div className="flex flex-col items-start gap-4 mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between gap-4 w-full">
        <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
        <CreateTeamDialog />
      </div>
      <div className="space-y-4 w-full">
        <TeamList />
      </div>
    </div>
  );
}
