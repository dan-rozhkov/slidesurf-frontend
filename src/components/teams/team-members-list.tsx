
import { useState } from "react";
import {
  useTeamMembers,
  useRemoveMember,
  useTransferOwnership,
} from "@/lib/hooks/use-teams";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IconCrown, IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useScopedI18n } from "@/lib/locales/client";
import { toast } from "sonner";
import type { TeamMember } from "@/types";
import { format } from "date-fns";
import { UserAvatar } from "@/components/user-avatar";

interface TeamMembersListProps {
  teamId: string;
  currentUserId: string;
  isOwner: boolean;
}

export function TeamMembersList({
  teamId,
  currentUserId,
  isOwner,
}: TeamMembersListProps) {
  const t = useScopedI18n("teams");
  const { data: members, isLoading: membersLoading } = useTeamMembers(teamId);

  if (membersLoading) {
    return <TeamMembersListSkeleton />;
  }

  if (!members || members.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[400px]">
        <div className="flex items-center justify-center size-9 rounded-md bg-accent">
          <IconCrown className="size-5" />
        </div>
        <p className="text-sm text-muted-foreground">{t("noMembers")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-muted-foreground w-full pl-5 pr-2">
        <div className="grid grid-cols-4">
          <div></div>
          <div>{t("role")}</div>
          <div>{t("joinedAt")}</div>
          <div></div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {members.map((member) => (
          <MemberItem
            key={member.id}
            member={member}
            teamId={teamId}
            currentUserId={currentUserId}
            isOwner={isOwner}
          />
        ))}
      </div>
    </div>
  );
}

interface MemberItemProps {
  member: TeamMember;
  teamId: string;
  currentUserId: string;
  isOwner: boolean;
}

function MemberItem({
  member,
  teamId,
  currentUserId,
  isOwner,
}: MemberItemProps) {
  const t = useScopedI18n("teams");
  const [confirmAction, setConfirmAction] = useState<
    "remove" | "transfer" | null
  >(null);

  const removeMember = useRemoveMember();
  const transferOwnership = useTransferOwnership();

  const isCurrentUser = member.userId === currentUserId;
  const isMemberOwner = member.role === "owner";

  const handleRemove = async () => {
    try {
      await removeMember.mutateAsync({
        teamId,
        userId: member.userId,
      });
      toast.success(t("memberRemoved"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("failedToRemoveMember")
      );
    }
    setConfirmAction(null);
  };

  const handleTransferOwnership = async () => {
    try {
      await transferOwnership.mutateAsync({
        teamId,
        newOwnerId: member.userId,
      });
      toast.success(t("ownershipTransferred"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("failedToTransferOwnership")
      );
    }
    setConfirmAction(null);
  };

  return (
    <>
      <div className="flex items-center justify-between border rounded-xl p-2 pl-5 text-sm transition-colors hover:bg-muted/50 min-h-[58px]">
        <div className="grid grid-cols-4 w-full items-center">
          <div className="flex items-center gap-2">
            <UserAvatar
              name={member.user?.name}
              email={member.user?.email}
              size="sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span>{member.user?.name || member.user?.email}</span>
                {isCurrentUser && (
                  <Badge variant="secondary" className="text-sm">
                    {t("you")}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div>
            {isMemberOwner ? (
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
            {member.joinedAt
              ? format(new Date(member.joinedAt), "dd.MM.yyyy")
              : "-"}
          </div>
          <div className="flex items-center justify-end">
            {isOwner && !isCurrentUser && !isMemberOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                  >
                    <IconDotsVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setConfirmAction("transfer")}
                  >
                    <IconCrown className="size-4" strokeWidth={1.5} />
                    {t("makeOwner")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setConfirmAction("remove")}>
                    <IconTrash className="size-4" strokeWidth={1.5} />
                    {t("removeMember")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Confirm remove dialog */}
      <AlertDialog
        open={confirmAction === "remove"}
        onOpenChange={() => setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("removeMemberTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("removeMemberDescription", {
                name: member.user?.name || member.user?.email || "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground"
            >
              {t("remove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm transfer dialog */}
      <AlertDialog
        open={confirmAction === "transfer"}
        onOpenChange={() => setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("transferOwnershipTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("transferOwnershipDescription", {
                name: member.user?.name || member.user?.email || "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleTransferOwnership}>
              {t("transferOwnership")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function TeamMembersListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}
