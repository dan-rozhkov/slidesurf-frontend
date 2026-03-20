import Editor from "@/components/editor";
import ThemeInit from "@/components/theme-init";

export default function EditorPage() {
  return (
    <main className="min-h-screen bg-[#FCFCFD] dark:bg-[#1A1A1A]">
      <ThemeInit />
      <Editor initialPresentation={undefined} />
    </main>
  );
}
