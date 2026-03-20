
import { useState, useEffect, useCallback } from "react";
import type { TeamWithRole } from "@/types";

const ACTIVE_TEAM_KEY = "active-team";

export function useActiveTeam(teams: TeamWithRole[] | undefined) {
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(ACTIVE_TEAM_KEY);
      if (stored) {
        setActiveTeamId(stored);
      }
      setIsLoaded(true);
    }
  }, []);

  // Validate that active team still exists in user's teams
  useEffect(() => {
    if (isLoaded && teams && activeTeamId) {
      const teamExists = teams.some((t) => t.id === activeTeamId);
      if (!teamExists) {
        setActiveTeamId(null);
        localStorage.removeItem(ACTIVE_TEAM_KEY);
      }
    }
  }, [teams, activeTeamId, isLoaded]);

  const setActiveTeam = useCallback((teamId: string | null) => {
    setActiveTeamId(teamId);
    if (teamId) {
      localStorage.setItem(ACTIVE_TEAM_KEY, teamId);
    } else {
      localStorage.removeItem(ACTIVE_TEAM_KEY);
    }
  }, []);

  const activeTeam = teams?.find((t) => t.id === activeTeamId) || null;

  return {
    activeTeamId,
    activeTeam,
    setActiveTeam,
    isLoaded,
  };
}
