import { useState } from "react";
import { apiFetch } from "@/api/client";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconUsers,
  IconCheck,
  IconX,
  IconClock,
  IconLoader,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { useScopedI18n } from "@/lib/locales/client";
import { toast } from "sonner";

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

interface InvitationPageClientProps {
  token: string;
  invitation: InvitationDetails | null;
  isAuthenticated: boolean;
  userEmail: string | null;
}

export default function InvitationPageClient({
  token,
  invitation,
  isAuthenticated,
  userEmail,
}: InvitationPageClientProps) {
  const t = useScopedI18n("teams");
  const navigate = useNavigate();
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      const res = await apiFetch(`/api/teams/invitations/${token}`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("failedToAcceptInvitation"));
      }

      toast.success(t("invitationAccepted"));
      navigate("/teams");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("failedToAcceptInvitation")
      );
    } finally {
      setIsAccepting(false);
    }
  };

  if (!invitation) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <IconX className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>{t("invitationNotFound")}</CardTitle>
          <CardDescription>{t("invitationNotFoundDescription")}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link to="/dashboard">
            <Button>{t("goToDashboard")}</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (invitation.isAccepted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <IconCheck className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>{t("invitationAlreadyAccepted")}</CardTitle>
          <CardDescription>
            {t("invitationAlreadyAcceptedDescription", {
              teamName: invitation.team.name,
            })}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link to="/teams">
            <Button>{t("goToTeams")}</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (invitation.isExpired) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
            <IconClock className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle>{t("invitationExpired")}</CardTitle>
          <CardDescription>{t("invitationExpiredDescription")}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link to="/dashboard">
            <Button>{t("goToDashboard")}</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <IconUsers className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>{t("teamInvitation")}</CardTitle>
          <CardDescription>
            {t("invitedToTeam", {
              teamName: invitation.team.name,
              inviterName: invitation.inviter.name || invitation.inviter.email,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {t("signInToAccept")}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link
            to={`/sign-in?redirect=/teams/invitations/${token}`}
            className="w-full"
          >
            <Button className="w-full">{t("signInAndAccept")}</Button>
          </Link>
          <Link
            to={`/sign-up?redirect=/teams/invitations/${token}`}
            className="w-full"
          >
            <Button variant="outline" className="w-full">
              {t("createAccountAndAccept")}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  const emailMatch =
    userEmail?.toLowerCase() === invitation.email.toLowerCase();
  if (!emailMatch) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
            <IconAlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle>{t("emailMismatch")}</CardTitle>
          <CardDescription>
            {t("emailMismatchDescription", { email: invitation.email })}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            {t("currentlySignedInAs", { email: userEmail })}
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Link to="/sign-in">
            <Button variant="outline">{t("signInWithDifferentAccount")}</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <IconUsers className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{t("teamInvitation")}</CardTitle>
        <CardDescription>
          {t("invitedToTeam", {
            teamName: invitation.team.name,
            inviterName: invitation.inviter.name || invitation.inviter.email,
          })}
        </CardDescription>
      </CardHeader>
      {invitation.team.description && (
        <CardContent>
          <p className="text-sm text-center text-muted-foreground">
            {invitation.team.description}
          </p>
        </CardContent>
      )}
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={handleAccept}
          disabled={isAccepting}
        >
          {isAccepting && <IconLoader className="size-4 animate-spin" />}
          {t("acceptInvitation")}
        </Button>
        <Link to="/dashboard" className="w-full">
          <Button variant="outline" className="w-full">
            {t("decline")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
