
import { useState } from "react";
import { apiFetch } from "@/api/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useTeams,
  useSharePresentationWithTeam,
  useUnsharePresentationFromTeam,
} from "@/lib/hooks/use-teams";
import { toast } from "sonner";
import {
  IconUsers,
  IconLoader2,
  IconShare,
  IconCrown,
  IconCheck,
} from "@tabler/icons-react";
import { useScopedI18n } from "@/lib/locales/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ShareWithTeamDialogProps {
  presentationId: string;
  presentationTitle: string;
  trigger?: React.ReactNode;
}

export function ShareWithTeamDialog({
  presentationId,
  presentationTitle,
  trigger,
}: ShareWithTeamDialogProps) {
  const t = useScopedI18n("teams");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: teams, isLoading: teamsLoading } = useTeams();
  const shareWithTeam = useSharePresentationWithTeam();
  const unshareFromTeam = useUnsharePresentationFromTeam();

  // Fetch teams this presentation is shared with
  const { data: sharedTeams, isLoading: sharedLoading } = useQuery({
    queryKey: ["presentation-teams", presentationId],
    queryFn: async () => {
      const res = await apiFetch(`/api/presentations/${presentationId}/teams`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.teams as { id: string; name: string }[];
    },
    enabled: open,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <IconShare className="mr-2 h-4 w-4" />
            {t("shareWithTeam")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("shareWithTeam")}</DialogTitle>
          <DialogDescription>
            {t("shareWithTeamDescription", { title: presentationTitle })}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {teamsLoading || sharedLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : teams && teams.length > 0 ? (
            <div className="space-y-2">
              {teams.map((team) => {
                const isShared = isSharedWithTeam(team.id);
                return (
                  <div
                    key={team.id}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border cursor-pointer
                      transition-colors hover:bg-muted/50
                      ${isShared ? "border-primary bg-primary/5" : ""}
                    `}
                    onClick={() =>
                      !isLoading && handleToggleShare(team.id, team.name)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isShared}
                          disabled={isLoading}
                          onCheckedChange={() =>
                            handleToggleShare(team.id, team.name)
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <IconUsers className="h-4 w-4 text-muted-foreground" />
                        <span>{team.name}</span>
                        {team.role === "owner" && (
                          <IconCrown className="h-3 w-3 text-amber-500" />
                        )}
                      </div>
                    </div>
                    {isShared && (
                      <Badge variant="secondary" className="text-xs">
                        <IconCheck className="h-3 w-3 mr-1" />
                        {t("shared")}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <IconUsers className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{t("noTeamsToShare")}</p>
              <p className="text-sm">{t("createTeamFirst")}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("done")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
