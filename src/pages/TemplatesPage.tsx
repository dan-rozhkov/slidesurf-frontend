import { useScopedI18n } from "@/lib/locales/client";

export default function TemplatesPage() {
  const t = useScopedI18n("templates");

  return (
    <div className="flex flex-col items-start gap-4 mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
    </div>
  );
}
