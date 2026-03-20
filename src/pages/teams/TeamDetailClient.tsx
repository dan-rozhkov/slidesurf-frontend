import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconArrowLeft,
  IconTrash,
  IconLogout,
  IconLoader,
  IconDotsVertical,
} from "@tabler/icons-react";
import { useScopedI18n } from "@/lib/locales/client";
import { toast } from "sonner";
import {
  TeamMembersList,
  TeamInvitationsList,
  InviteMemberDialog,
} from "@/components/teams";
import { useDeleteTeam, useLeaveTeam } from "@/lib/hooks/use-teams";
import type { TeamWithMembers } from "@/types";

interface TeamDetailClientProps {
  team: TeamWithMembers;
  currentUserId: string;
  isOwner: boolean;
}

export default function TeamDetailClient({
  team,
  currentUserId,
  isOwner,
}: TeamDetailClientProps) {
  const t = useScopedI18n("teams");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("members");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const deleteTeam = useDeleteTeam();
  const leaveTeam = useLeaveTeam();

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam.mutateAsync(team.id);
      toast.success(t("teamDeleted"));
      navigate("/teams");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("failedToDeleteTeam")
      );
    }
    setShowDeleteDialog(false);
  };

  const handleLeaveTeam = async () => {
    try {
      await leaveTeam.mutateAsync(team.id);
      toast.success(t("leftTeam"));
      navigate("/teams");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("failedToLeaveTeam")
      );
    }
    setShowLeaveDialog(false);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-4">
        <Link to="/teams">
          <Button variant="outline" size="icon">
            <IconArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 flex items-center gap-2">
          <h1 className="text-xl font-bold">{team.name}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground size-8"
              >
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwner ? (
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                  <IconTrash className="size-4" strokeWidth={1.5} />
                  {t("deleteTeam")}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => setShowLeaveDialog(true)}>
                  <IconLogout className="size-4" strokeWidth={1.5} />
                  {t("leaveTeam")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{t("teamMembers")}</h2>
          <InviteMemberDialog teamId={team.id} teamName={team.name} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="members">{t("members")}</TabsTrigger>
            <TabsTrigger value="invitations">
              {t("pendingInvitations")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="members" className="mt-4">
            <TeamMembersList
              teamId={team.id}
              currentUserId={currentUserId}
              isOwner={isOwner}
            />
          </TabsContent>
          <TabsContent value="invitations" className="mt-4">
            <TeamInvitationsList teamId={team.id} isOwner={isOwner} />
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTeamTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteTeamConfirmation", { teamName: team.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              className="bg-destructive text-destructive-foreground"
              disabled={deleteTeam.isPending}
            >
              {deleteTeam.isPending && (
                <IconLoader className="size-4 animate-spin" />
              )}
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("leaveTeamTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("leaveTeamConfirmation", { teamName: team.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveTeam}
              className="bg-destructive text-destructive-foreground"
              disabled={leaveTeam.isPending}
            >
              {leaveTeam.isPending && (
                <IconLoader className="size-4 animate-spin" />
              )}
              {t("leave")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
