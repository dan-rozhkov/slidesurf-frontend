
import { useTeams } from "@/lib/hooks/use-teams";
import { useActiveTeam } from "@/lib/hooks/use-active-team";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconUsers,
  IconChevronDown,
  IconCrown,
  IconCheck,
  IconUserPlus,
} from "@tabler/icons-react";
import { useScopedI18n } from "@/lib/locales/client";
import { CreateTeamDialog } from "./create-team-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface TeamSelectorProps {
  onTeamChange?: (teamId: string | null) => void;
}

export function TeamSelector({ onTeamChange }: TeamSelectorProps) {
  const t = useScopedI18n("teams");
  const { data: teams, isLoading } = useTeams();
  const { activeTeamId, activeTeam, setActiveTeam } = useActiveTeam(teams);

  if (isLoading) {
    return <Skeleton className="h-9 w-[180px]" />;
  }

  const handleTeamSelect = (teamId: string | null) => {
    setActiveTeam(teamId);
    onTeamChange?.(teamId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-between">
          <div className="flex items-center gap-2 truncate">
            <IconUsers className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {activeTeam?.name || t("personal")}
            </span>
          </div>
          <IconChevronDown className="h-4 w-4 flex-shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[220px]" align="start">
        <DropdownMenuLabel>{t("workspace")}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Personal workspace */}
        <DropdownMenuItem
          onClick={() => handleTeamSelect(null)}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <IconUsers className="h-4 w-4" />
              <span>{t("personal")}</span>
            </div>
            {!activeTeamId && <IconCheck className="h-4 w-4 text-primary" />}
          </div>
        </DropdownMenuItem>

        {/* Team workspaces */}
        {teams && teams.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              {t("teams")}
            </DropdownMenuLabel>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleTeamSelect(team.id)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <IconUsers className="h-4 w-4" />
                    <span className="truncate max-w-[120px]">{team.name}</span>
                    {team.role === "owner" && (
                      <IconCrown className="h-3 w-3 text-amber-500" />
                    )}
                  </div>
                  {activeTeamId === team.id && (
                    <IconCheck className="h-4 w-4 text-primary" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}

        <DropdownMenuSeparator />
        <CreateTeamDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="cursor-pointer"
            >
              <IconUserPlus className="h-4 w-4 mr-2" />
              {t("createTeam")}
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
