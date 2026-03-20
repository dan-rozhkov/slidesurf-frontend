
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInviteMember } from "@/lib/hooks/use-teams";
import { toast } from "sonner";
import { IconPlus, IconLoader, IconMail } from "@tabler/icons-react";
import { useScopedI18n } from "@/lib/locales/client";

interface InviteMemberDialogProps {
  teamId: string;
  teamName: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function InviteMemberDialog({
  teamId,
  teamName,
  trigger,
  onSuccess,
}: InviteMemberDialogProps) {
  const t = useScopedI18n("teams");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const inviteMember = useInviteMember();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error(t("emailRequired"));
      return;
    }

    try {
      await inviteMember.mutateAsync({
        teamId,
        email: email.trim().toLowerCase(),
      });

      toast.success(t("invitationSent"));
      setOpen(false);
      setEmail("");
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("failedToInvite"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <IconPlus className="size-4" />
            {t("inviteMember")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("inviteMember")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("email")}</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="pl-9"
                />
                <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                {t("invitationExpiryNote")}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={inviteMember.isPending}
              className="w-full mt-2"
            >
              {inviteMember.isPending && (
                <IconLoader className="size-4 animate-spin" />
              )}
              {t("sendInvitation")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
