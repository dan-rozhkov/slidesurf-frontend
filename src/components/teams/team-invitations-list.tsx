
import { useTeamInvitations, useCancelInvitation } from "@/lib/hooks/use-teams";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconMail, IconX } from "@tabler/icons-react";
import { useScopedI18n } from "@/lib/locales/client";
import { toast } from "sonner";
import type { TeamInvitation } from "@/types";
import { format } from "date-fns";

interface TeamInvitationsListProps {
  teamId: string;
  isOwner: boolean;
}

export function TeamInvitationsList({
  teamId,
  isOwner,
}: TeamInvitationsListProps) {
  const t = useScopedI18n("teams");
  const { data: invitations, isLoading: invitationsLoading } =
    useTeamInvitations(teamId);

  if (invitationsLoading) {
    return <TeamInvitationsListSkeleton />;
  }

  if (!invitations || invitations.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[400px]">
        <div className="flex items-center justify-center size-9 rounded-md bg-accent">
          <IconMail className="size-5" />
        </div>
        <p className="text-sm text-muted-foreground">{t("noInvitations")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-muted-foreground w-full pl-5 pr-2">
        <div className="grid grid-cols-4">
          <div></div>
          <div>{t("status")}</div>
          <div>{t("expiresAt")}</div>
          <div></div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {invitations.map((invitation) => (
          <InvitationItem
            key={invitation.id}
            invitation={invitation}
            teamId={teamId}
            isOwner={isOwner}
          />
        ))}
      </div>
    </div>
  );
}

interface InvitationItemProps {
  invitation: TeamInvitation;
  teamId: string;
  isOwner: boolean;
}

function InvitationItem({ invitation, teamId, isOwner }: InvitationItemProps) {
  const t = useScopedI18n("teams");
  const cancelInvitation = useCancelInvitation();

  const handleCancel = async () => {
    try {
      await cancelInvitation.mutateAsync({
        teamId,
        invitationId: invitation.id,
      });
      toast.success(t("invitationCancelled"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("failedToCancelInvitation")
      );
    }
  };

  return (
    <div className="flex items-center justify-between border rounded-xl p-2 pl-5 text-sm transition-colors hover:bg-muted/50">
      <div className="grid grid-cols-4 w-full items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
            <IconMail className="h-4 w-4 text-muted-foreground" />
          </div>
          <span>{invitation.email}</span>
        </div>
        <div>
          <Badge variant="outline" className="text-sm">
            {t("pending")}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {format(new Date(invitation.expiresAt), "dd.MM.yyyy")}
        </div>
        <div className="flex items-center justify-end">
          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={cancelInvitation.isPending}
              className="text-muted-foreground"
            >
              <IconX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function TeamInvitationsListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}
