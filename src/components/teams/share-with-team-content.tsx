
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useTeams,
  useSharePresentationWithTeam,
  useUnsharePresentationFromTeam,
} from "@/lib/hooks/use-teams";
import { toast } from "sonner";
import { IconUsers, IconCrown, IconCheck, IconPlus } from "@tabler/icons-react";
import { useScopedI18n } from "@/lib/locales/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ShareWithTeamContentProps {
  presentationId: string;
  presentationTitle: string;
}

export function ShareWithTeamContent({
  presentationId,
  presentationTitle,
}: ShareWithTeamContentProps) {
  const t = useScopedI18n("teams");
  const queryClient = useQueryClient();

  const { data: teams, isLoading: teamsLoading } = useTeams();
  const shareWithTeam = useSharePresentationWithTeam();
  const unshareFromTeam = useUnsharePresentationFromTeam();

  // Fetch teams this presentation is shared with
  const { data: sharedTeams, isLoading: sharedLoading } = useQuery({
    queryKey: ["presentation-teams", presentationId],
    queryFn: async () => {
      const res = await fetch(`/api/presentations/${presentationId}/teams`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.teams as { id: string; name: string }[];
    },
  });

  const isSharedWithTeam = (teamId: string) =>
    sharedTeams?.some((t) => t.id === teamId) ?? false;

  const handleToggleShare = async (teamId: string, teamName: string) => {
    const isCurrentlyShared = isSharedWithTeam(teamId);

    try {
      if (isCurrentlyShared) {
        await unshareFromTeam.mutateAsync({ teamId, presentationId });
        toast.success(t("presentationUnshared", { teamName }));
      } else {
        await shareWithTeam.mutateAsync({ teamId, presentationId });
        toast.success(t("presentationShared", { teamName }));
      }
      // Invalidate the query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["presentation-teams", presentationId],
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("failedToSharePresentation")
      );
    }
  };

  const isLoading = shareWithTeam.isPending || unshareFromTeam.isPending;

  if (teamsLoading || sharedLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full py-10">
        <div className="flex items-center justify-center size-9 rounded-md bg-accent">
          <IconUsers className="size-5" />
        </div>
        <p className="text-sm text-muted-foreground">{t("noTeamsToShare")}</p>
        <Link to="/teams">
          <Button size="sm">
            <IconPlus className="size-4" />
            {t("createTeam")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">
        {t("shareWithTeamDescription", { title: presentationTitle })}
      </p>
      {teams.map((team) => {
        const isShared = isSharedWithTeam(team.id);
        return (
          <div
            key={team.id}
            className={`
              flex items-center justify-between p-3 rounded-lg cursor-pointer
              transition-colors hover:bg-muted/50
              ${isShared ? "bg-primary/5" : ""}
            `}
            onClick={() => !isLoading && handleToggleShare(team.id, team.name)}
          >
            <div className="flex items-center gap-2">
              <IconUsers
                className="size-4 text-muted-foreground"
                strokeWidth={1.5}
              />
              <span className="text-sm">{team.name}</span>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Switch
                checked={isShared}
                disabled={isLoading}
                onCheckedChange={() => handleToggleShare(team.id, team.name)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
