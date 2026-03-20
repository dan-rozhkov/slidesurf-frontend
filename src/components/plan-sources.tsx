
import {
  Task,
  TaskContent,
  TaskItem,
  TaskTrigger,
} from "@/components/ai-elements/task";
import { useScopedI18n } from "@/lib/locales/client";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

type ResearchSource = {
  title?: string;
  url?: string;
  snippet?: string;
};

type PlanSourcesProps = {
  sources: ResearchSource[];
};

const getHostname = (url?: string) => {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const getFaviconUrl = (url?: string) => {
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return null;
  }
};

export function PlanSources({ sources }: PlanSourcesProps) {
  const t = useScopedI18n("generate");
  const [brokenFavicons, setBrokenFavicons] = useState<Set<string>>(
    () => new Set()
  );

  if (sources.length === 0) return null;

  const faviconUrls = Array.from(
    new Set(sources.map((source) => getFaviconUrl(source.url)).filter(Boolean))
  ).filter((url) => !brokenFavicons.has(url as string))
    .slice(0, 4) as string[];

  return (
    <Task defaultOpen={false} className="mx-auto max-w-2xl w-full">
      <TaskTrigger
        title={t("sourcesFound", { count: sources.length })}
        className="rounded-lg bg-card px-4 py-2 text-foreground"
      >
        <div className="group flex w-full cursor-pointer items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground">
          <div className="flex items-center -space-x-2">
            {faviconUrls.map((url, index) => (
              <span
                key={`${url}-${index}`}
                className="flex h-6 w-6 items-center justify-center rounded-full border bg-background"
              >
                <img
                  src={url}
                  alt=""
                  className="h-4 w-4"
                  onError={() =>
                    setBrokenFavicons((prev) => {
                      const next = new Set(prev);
                      next.add(url);
                      return next;
                    })
                  }
                />
              </span>
            ))}
          </div>
          <p className="text-sm">
            {t("sourcesFound", { count: sources.length })}
          </p>
          <ChevronDownIcon className="size-4 transition-transform group-data-[state=open]:rotate-180" />
        </div>
      </TaskTrigger>
      <TaskContent>
        {sources.map((source, index) => {
          const label = source.title || source.url || t("source");
          const hostname = getHostname(source.url);

          return (
            <TaskItem key={`${source.url || label}-${index}`}>
              <div className="flex flex-col gap-1">
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-foreground hover:underline"
                  >
                    {label}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-foreground">{label}</p>
                )}
                {source.url && (
                  <span className="text-xs text-muted-foreground">
                    {source.url}
                  </span>
                )}
                {hostname && (
                  <span className="text-xs text-muted-foreground">
                    {hostname}
                  </span>
                )}
                {source.snippet && (
                  <span className="text-xs text-muted-foreground">
                    {source.snippet}
                  </span>
                )}
              </div>
            </TaskItem>
          );
        })}
      </TaskContent>
    </Task>
  );
}
