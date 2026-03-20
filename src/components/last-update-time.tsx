
import { cn } from "@/lib/utils";
import { intlFormatDistance } from "date-fns";
import { memo, useEffect, useState } from "react";
import { useScopedI18n } from "@/lib/locales/client";

type LastUpdateTimeProps = {
  lastUpdate: Date;
  className?: string;
};

export const LastUpdateTime = memo(
  ({ lastUpdate, className }: LastUpdateTimeProps) => {
    const t = useScopedI18n("editor");
    const [text, setText] = useState<string>("");

    useEffect(() => {
      // Compute on client to avoid SSR/CSR mismatch
      const compute = () => {
        if (!lastUpdate || isNaN(new Date(lastUpdate).getTime())) {
          return "";
        }
        return intlFormatDistance(new Date(lastUpdate), new Date());
      };
      setText(compute());

      // Optional: refresh every minute to keep it up to date
      const id = setInterval(() => setText(compute()), 60_000);
      return () => clearInterval(id);
    }, [lastUpdate]);

    return (
      <span className={cn("text-xs text-muted-foreground", className)}>
        {t("saved")} {text || t("recently")}
      </span>
    );
  }
);

LastUpdateTime.displayName = "LastUpdateTime";
