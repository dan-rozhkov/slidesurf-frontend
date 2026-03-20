
import { useGenerationsUsage } from "@/lib/hooks/use-generations-usage";
import { useScopedI18n } from "@/lib/locales/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { isSubscriptionEnabled } from "@/lib/subscription-utils";

export function GenerationsUsageCard() {
  const { data: usage, isPending } = useGenerationsUsage();

  if (!isSubscriptionEnabled()) return null;
  const t = useScopedI18n("generationsUsage");

  if (isPending) {
    return (
      <div className="flex flex-col gap-2 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse">
        <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
      </div>
    );
  }

  if (!usage) {
    return null;
  }

  const usagePercentage = Math.round((usage.used / usage.limit) * 100);

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
      <span className="text-xs text-neutral-600 dark:text-neutral-400">
        {t("title")}
      </span>

      <span className="text-sm text-neutral-500 dark:text-neutral-400 tracking-tight">
        {usage.used} / {usage.limit}
      </span>

      <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 bg-neutral-600 dark:bg-neutral-400"
          style={{ width: `${usagePercentage}%` }}
        />
      </div>

      <Link to="/settings?tab=subscription">
        <Button
          variant="ghost"
          className="w-full bg-primary/5 mt-1.5 text-primary hover:bg-primary/10"
          size="sm"
        >
          <Zap className="size-4" />
          {t("upgrade")}
        </Button>
      </Link>
    </div>
  );
}
