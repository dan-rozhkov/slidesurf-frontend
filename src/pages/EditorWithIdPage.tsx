import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Editor from "@/components/editor";
import ThemeInit from "@/components/theme-init";
import EditorLoadingScreen from "@/components/editor-loading-screen";
import * as presentationsApi from "@/api/presentations";
import type { Presentation } from "@/types";

export default function EditorWithIdPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isRefetching } = useQuery<Presentation | null>({
    queryKey: ["presentation", id],
    queryFn: () => presentationsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading || isRefetching || !data) {
    return (
      <main className="min-h-screen bg-[#FCFCFD] dark:bg-[#1A1A1A]">
        <EditorLoadingScreen />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFCFD] dark:bg-[#1A1A1A]">
      <ThemeInit />
      <Editor initialPresentation={data} />
    </main>
  );
}
