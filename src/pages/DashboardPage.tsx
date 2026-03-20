import DashboardActions from "@/components/dashboard-actions";
import PresentationsList from "@/components/presentations-list";
import { useScopedI18n } from "@/lib/locales/client";
import { AdsBanner } from "@/components/ads-banner";

export default function DashboardPage() {
  const t = useScopedI18n("dashboard");

  return (
    <div>
      <div className="flex flex-col items-start gap-4 mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
        <div className="flex gap-4">
          <DashboardActions />
        </div>
      </div>

      <AdsBanner
        promoCode="BLACKFRIDAY"
        title="Скидка 50% на все подписки"
        description="Доступ к премиум моделям для генерации текста и картинок в презентации"
        buttonText="Купить со скидкой"
      />

      <PresentationsList />
    </div>
  );
}
