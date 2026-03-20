
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/api/client";
import type {
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
      const data = await apiRequest<{ teams: TeamWithRole[] }>("/api/teams");
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
      const data = await apiRequest<{ team: TeamWithMembers }>(`/api/teams/${teamId}`);
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
      const data = await apiRequest<{ members: TeamMember[] }>(`/api/teams/${teamId}/members`);
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
      const data = await apiRequest<{ invitations: TeamInvitation[] }>(`/api/teams/${teamId}/invitations`);
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
      return apiRequest("/api/teams", {
        method: "POST",
        body: JSON.stringify(data),
      });
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
      return apiRequest(`/api/teams/${teamId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
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
      return apiRequest(`/api/teams/${teamId}`, {
        method: "DELETE",
      });
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
      return apiRequest(`/api/teams/${teamId}/members`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
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
      return apiRequest(`/api/teams/${teamId}/members`, {
        method: "DELETE",
        body: JSON.stringify({ userId }),
      });
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
      return apiRequest(`/api/teams/${teamId}/leave`, {
        method: "POST",
      });
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
      return apiRequest(`/api/teams/${teamId}/transfer-ownership`, {
        method: "POST",
        body: JSON.stringify({ newOwnerId }),
      });
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
      return apiRequest(`/api/teams/${teamId}/invitations`, {
        method: "DELETE",
        body: JSON.stringify({ invitationId }),
      });
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
      return apiRequest(`/api/teams/${teamId}/presentations`, {
        method: "POST",
        body: JSON.stringify({ presentationId }),
      });
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
      return apiRequest(`/api/teams/${teamId}/presentations`, {
        method: "DELETE",
        body: JSON.stringify({ presentationId }),
      });
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
      const data = await apiRequest<{ presentations: any[] }>(`/api/teams/${teamId}/presentations`);
      return data.presentations;
    },
    enabled: !!teamId,
  });
}
