import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import TeamDetailClient from "./teams/TeamDetailClient";
import { apiRequest } from "@/api/client";
import type { TeamWithMembers } from "@/types";

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = authClient.useSession();

  const { data: team, isLoading } = useQuery<TeamWithMembers>({
    queryKey: ["team", id],
    queryFn: () => apiRequest<TeamWithMembers>(`/api/teams/${id}`),
    enabled: !!id,
  });

  if (isLoading || !team) {
    return (
      <div className="flex flex-col items-start gap-4 mx-auto max-w-7xl px-4 py-8 h-full">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const currentUserRole = team.members.find(
    (m) => m.userId === session?.user?.id
  )?.role;

  return (
    <div className="flex flex-col items-start gap-4 mx-auto max-w-7xl px-4 py-8 h-full">
      <TeamDetailClient
        team={team}
        currentUserId={session?.user?.id || ""}
        isOwner={currentUserRole === "owner"}
      />
    </div>
  );
}
