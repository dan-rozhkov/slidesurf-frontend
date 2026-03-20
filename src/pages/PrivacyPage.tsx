import { privacyContent } from "./content/privacy.ru";

export default function PrivacyPage() {
  return (
    <div className="grid grid-cols-1">
      <main className="min-h-screen bg-[#FCFCFD] dark:bg-[#1A1A1A]">
        <div className="flex flex-col items-start gap-6 mx-auto max-w-4xl px-4 py-8">
          <div className="w-full">
            {/* <MarkdownRenderer content={privacyContent} /> */}
          </div>
        </div>
      </main>
    </div>
  );
}
