import Editor from "@/components/editor";
import ThemeInit from "@/components/theme-init";
import { usePresentationAtom } from "@/lib/hooks/use-presentation";

export default function EditorPreviewPage() {
  const [presentation] = usePresentationAtom();

  return (
    <main className="min-h-screen bg-[#FCFCFD] dark:bg-[#1A1A1A]">
      <ThemeInit />
      <Editor initialPresentation={presentation} />
    </main>
  );
}
