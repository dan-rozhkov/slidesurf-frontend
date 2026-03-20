import SettingsPageClient from "./settings/SettingsPageClient";
import { useScopedI18n } from "@/lib/locales/client";

export default function SettingsPage() {
  const t = useScopedI18n("settings");

  return (
    <div className="flex flex-col items-start gap-4 mx-auto max-w-7xl px-4 py-8 h-full">
      <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
      <SettingsPageClient />
    </div>
  );
}
