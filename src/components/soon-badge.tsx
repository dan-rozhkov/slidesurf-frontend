
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/locales/client";

export function SoonBadge({ className }: { className?: string }) {
  const t = useI18n();

  return (
    <Badge
      variant="outline"
      className={cn("bg-background text-muted-foreground", className)}
    >
      {t("soon")}
    </Badge>
  );
}
