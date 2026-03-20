
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Team,
  TeamWithRole,
  TeamWithMembers,
  TeamMember,
  TeamInvitation,
} from "@/types";

// Fetch all teams for the current user
export function useTeams() {
  return useQuery<TeamWithRole[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await fetch("/api/teams");
      if (!res.ok) {
        throw new Error("Failed to fetch teams");
      }
      const data = await res.json();
      return data.teams;
    },
  });
}

// Fetch a specific team by ID
export function useTeam(teamId: string | null) {
  return useQuery<TeamWithMembers | null>({
    queryKey: ["team", teamId],
    queryFn: async () => {
      if (!teamId) return null;
      const res = await fetch(`/api/teams/${teamId}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch team");
      }
      const data = await res.json();
      return data.team;
    },
    enabled: !!teamId,
  });
}

// Fetch team members
export function useTeamMembers(teamId: string | null) {
  return useQuery<TeamMember[]>({
    queryKey: ["team-members", teamId],
    queryFn: async () => {
      if (!teamId) return [];
      const res = await fetch(`/api/teams/${teamId}/members`);
      if (!res.ok) {
        throw new Error("Failed to fetch team members");
      }
      const data = await res.json();
      return data.members;
    },
    enabled: !!teamId,
  });
}

// Fetch team invitations
export function useTeamInvitations(teamId: string | null) {
  return useQuery<TeamInvitation[]>({
    queryKey: ["team-invitations", teamId],
    queryFn: async () => {
      if (!teamId) return [];
      const res = await fetch(`/api/teams/${teamId}/invitations`);
      if (!res.ok) {
        throw new Error("Failed to fetch team invitations");
      }
      const data = await res.json();
      return data.invitations;
    },
    enabled: !!teamId,
  });
}

// Create team mutation
export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create team");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

// Update team mutation
export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      data,
    }: {
      teamId: string;
      data: { name?: string; description?: string };
    }) => {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update team");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team", variables.teamId] });
    },
  });
}

// Delete team mutation
export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete team");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

// Invite member mutation
export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      email,
    }: {
      teamId: string;
      email: string;
    }) => {
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to invite member");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team-invitations", variables.teamId],
      });
    },
  });
}

// Remove member mutation
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      userId,
    }: {
      teamId: string;
      userId: string;
    }) => {
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to remove member");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team-members", variables.teamId],
      });
      queryClient.invalidateQueries({ queryKey: ["team", variables.teamId] });
    },
  });
}

// Leave team mutation
export function useLeaveTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      const res = await fetch(`/api/teams/${teamId}/leave`, {
        method: "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to leave team");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

// Transfer ownership mutation
export function useTransferOwnership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      newOwnerId,
    }: {
      teamId: string;
      newOwnerId: string;
    }) => {
      const res = await fetch(`/api/teams/${teamId}/transfer-ownership`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newOwnerId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to transfer ownership");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team", variables.teamId] });
      queryClient.invalidateQueries({
        queryKey: ["team-members", variables.teamId],
      });
    },
  });
}

// Cancel invitation mutation
export function useCancelInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      invitationId,
    }: {
      teamId: string;
      invitationId: string;
    }) => {
      const res = await fetch(`/api/teams/${teamId}/invitations`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to cancel invitation");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team-invitations", variables.teamId],
      });
    },
  });
}

// Share presentation with team mutation
export function useSharePresentationWithTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      presentationId,
    }: {
      teamId: string;
      presentationId: string;
    }) => {
      const res = await fetch(`/api/teams/${teamId}/presentations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presentationId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to share presentation");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team-presentations", variables.teamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["presentation-teams", variables.presentationId],
      });
    },
  });
}

// Unshare presentation from team mutation
export function useUnsharePresentationFromTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      presentationId,
    }: {
      teamId: string;
      presentationId: string;
    }) => {
      const res = await fetch(`/api/teams/${teamId}/presentations`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presentationId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to unshare presentation");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team-presentations", variables.teamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["presentation-teams", variables.presentationId],
      });
    },
  });
}

// Fetch team shared presentations
export function useTeamPresentations(teamId: string | null) {
  return useQuery({
    queryKey: ["team-presentations", teamId],
    queryFn: async () => {
      if (!teamId) return [];
      const res = await fetch(`/api/teams/${teamId}/presentations`);
      if (!res.ok) {
        throw new Error("Failed to fetch team presentations");
      }
      const data = await res.json();
      return data.presentations;
    },
    enabled: !!teamId,
  });
}

