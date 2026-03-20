
import { useTeams } from "@/lib/hooks/use-teams";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconUsers, IconCrown, IconSettings } from "@tabler/icons-react";
import { useScopedI18n } from "@/lib/locales/client";
import { toast } from "sonner";
import type { TeamWithRole } from "@/types";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface TeamListProps {
  showManageButton?: boolean;
}

export function TeamList({ showManageButton = true }: TeamListProps) {
  const t = useScopedI18n("teams");
  const { data: teams, isLoading, error } = useTeams();

  if (error) {
    toast.error(error.message);
  }

  if (!teams?.length && !isLoading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[400px]">
        <div className="flex items-center justify-center size-9 rounded-md bg-accent">
          <IconUsers className="size-5" />
        </div>
        <p className="text-sm text-muted-foreground">{t("noTeams")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-muted-foreground w-full pl-5 pr-2">
        <div className="grid grid-cols-4">
          <div></div>
          <div>{t("role")}</div>
          <div>{t("createdAt")}</div>
          <div></div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {teams?.map((team) => (
          <div key={team.id}>
            <TeamListItem team={team} showManageButton={showManageButton} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface TeamListItemProps {
  team: TeamWithRole;
  showManageButton?: boolean;
}

function TeamListItem({ team, showManageButton }: TeamListItemProps) {
  const t = useScopedI18n("teams");

  return (
    <Link to={`/teams/${team.id}`}>
      <div
        className={`
          flex items-center justify-between border rounded-xl p-2 pl-5 cursor-pointer
          transition-colors hover:bg-muted/50 text-sm
        `}
      >
        <div className="grid grid-cols-4 w-full items-center">
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span>{team.name}</span>
              </div>
            </div>
          </div>
          <div>
            {team.role === "owner" ? (
              <Badge variant="secondary" className="text-sm">
                <IconCrown className="size-4 mr-2" strokeWidth={1.5} />
                {t("owner")}
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-sm">
                {t("member")}
              </Badge>
            )}
          </div>
          <div>
            {team.createdAt
              ? format(new Date(team.createdAt), "dd.MM.yyyy")
              : "-"}
          </div>
          <div className="flex items-center justify-end">
            {showManageButton && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
              >
                <IconSettings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TeamListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}
