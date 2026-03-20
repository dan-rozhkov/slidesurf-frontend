import { useQuery } from "@tanstack/react-query";
import * as presentationsApi from "@/api/presentations";
import PresentationThumb from "@/components/presentation-thumb";
import { useScopedI18n } from "@/lib/locales/client";
import { Presentation } from "lucide-react";

export function SharedPresentationsList() {
  const { data: presentations, isLoading } = useQuery({
    queryKey: ["shared-presentations"],
    queryFn: presentationsApi.getSharedWithMe,
  });
  const t = useScopedI18n("sharedWithMe");

  if (isLoading || !presentations) {
    return (
      <div className="grid grid-cols-4 gap-4 mx-auto max-w-7xl px-4 pb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="aspect-video bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 mx-auto max-w-7xl px-4 pb-8">
      {presentations.map((presentation) => (
        <PresentationThumb key={presentation.id} presentation={presentation} />
      ))}

      {presentations.length === 0 && (
        <div className="col-span-4 flex flex-col gap-4 items-center justify-center w-full min-h-[400px]">
          <div className="flex items-center justify-center size-9 rounded-md bg-accent">
            <Presentation className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">
            {t("noPresentations")}
          </p>
        </div>
      )}
    </div>
  );
}
