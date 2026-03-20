
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTeam } from "@/lib/hooks/use-teams";
import { toast } from "sonner";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";
import { useScopedI18n } from "@/lib/locales/client";

interface CreateTeamDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateTeamDialog({
  trigger,
  onSuccess,
}: CreateTeamDialogProps) {
  const t = useScopedI18n("teams");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const createTeam = useCreateTeam();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t("nameRequired"));
      return;
    }

    try {
      await createTeam.mutateAsync({
        name: name.trim(),
      });

      toast.success(t("teamCreated"));
      setOpen(false);
      setName("");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("failedToCreateTeam")
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <IconPlus className="size-4" />
            {t("create")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("createTeam")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("teamName")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("teamNamePlaceholder")}
                maxLength={100}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createTeam.isPending}>
              {createTeam.isPending && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
