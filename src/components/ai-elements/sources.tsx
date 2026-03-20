
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, GlobeIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useScopedI18n } from "@/lib/locales/client";
import { useState, useMemo } from "react";

export type SourcesProps = ComponentProps<"div">;

export const Sources = ({ className, ...props }: SourcesProps) => (
  <Collapsible
    className={cn("not-prose text-primary text-xs -mb-4", className)}
    {...props}
  />
);

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  count: number;
};

export const SourcesTrigger = ({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) => {
  const t = useScopedI18n("chat");

  return (
    <CollapsibleTrigger
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {children ?? (
        <>
          <p>{t("usedSources", { count })}</p>
          <ChevronDownIcon className="h-4 w-4" strokeWidth={1.5} />
        </>
      )}
    </CollapsibleTrigger>
  );
};

export type SourcesContentProps = ComponentProps<typeof CollapsibleContent>;

export const SourcesContent = ({
  className,
  ...props
}: SourcesContentProps) => (
  <CollapsibleContent
    className={cn(
      "my-3 flex w-fit flex-col",
      "data-[state=closed]:hidden",
      className
    )}
    {...props}
  />
);

export type SourceProps = ComponentProps<"a">;

const getFaviconUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace("www.", "");
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
  } catch {
    return null;
  }
};

export const Source = ({ href, title, children, ...props }: SourceProps) => {
  const [faviconError, setFaviconError] = useState(false);
  const faviconUrl = useMemo(() => (href ? getFaviconUrl(href) : null), [href]);

  return (
    <a
      className="flex items-center gap-2"
      href={href}
      rel="noreferrer"
      target="_blank"
      {...props}
    >
      {children ?? (
        <div className="flex items-start gap-2">
          {faviconUrl && !faviconError ? (
            <img
              src={faviconUrl}
              alt=""
              className="h-4 w-4 shrink-0"
              onError={() => setFaviconError(true)}
            />
          ) : (
            <GlobeIcon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          )}
          <span className="grow">{title}</span>
        </div>
      )}
    </a>
  );
};
