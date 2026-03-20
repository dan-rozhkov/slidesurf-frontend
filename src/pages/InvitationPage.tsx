import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import InvitationPageClient from "./teams/InvitationPageClient";
import { apiRequest } from "@/api/client";

interface InvitationDetails {
  id: string;
  email: string;
  expiresAt: Date;
  team: {
    id: string;
    name: string;
    description?: string | null;
  };
  inviter: {
    id: string;
    name: string;
    email: string;
  };
  isExpired: boolean;
  isAccepted: boolean;
}

export default function InvitationPage() {
  const { token } = useParams<{ token: string }>();
  const { data: session } = authClient.useSession();

  const { data: invitation, isLoading } = useQuery<InvitationDetails | null>({
    queryKey: ["invitation", token],
    queryFn: () => apiRequest<InvitationDetails | null>(`/api/teams/invitations/${token}`),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFCFD] dark:bg-[#1A1A1A]">
        <div className="animate-pulse h-64 w-96 bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFCFD] dark:bg-[#1A1A1A]">
      <InvitationPageClient
        token={token!}
        invitation={invitation || null}
        isAuthenticated={!!session?.user}
        userEmail={session?.user?.email || null}
      />
    </div>
  );
}
