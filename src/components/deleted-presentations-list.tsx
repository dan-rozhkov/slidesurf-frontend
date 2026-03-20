import { useQuery } from "@tanstack/react-query";
import * as presentationsApi from "@/api/presentations";
import PresentationThumb from "@/components/presentation-thumb";
import { useScopedI18n } from "@/lib/locales/client";
import { Trash } from "lucide-react";

export default function DeletedPresentationsList() {
  const { data: presentations, isLoading } = useQuery({
    queryKey: ["deleted-presentations"],
    queryFn: presentationsApi.getDeleted,
  });
  const t = useScopedI18n("dashboard");

  if (isLoading || !presentations) {
    return (
      <div className="grid grid-cols-4 gap-4 mx-auto max-w-7xl px-4 py-8">
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
    <div className="grid grid-cols-4 gap-4 mx-auto max-w-7xl px-4 py-8">
      {presentations.map((presentation) => (
        <PresentationThumb key={presentation.id} presentation={presentation} />
      ))}

      {presentations.length === 0 && (
        <div className="col-span-4 flex flex-col gap-4 items-center justify-center w-full min-h-[400px]">
          <div className="flex items-center justify-center size-9 rounded-md bg-accent">
            <Trash className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">{t("trashEmpty")}</p>
        </div>
      )}
    </div>
  );
}
