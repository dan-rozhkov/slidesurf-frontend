
import PricingCard from "@/components/settings/pricing-card";
import { useScopedI18n } from "@/lib/locales/client";
import { isSubscriptionEnabled } from "@/lib/subscription-utils";

type PromoCodeData = {
  id: string;
  code: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
};

type PricingPlansGridProps = {
  onUpgrade: (planType: "plus" | "pro") => void;
  isLoading: boolean;
  currentPlan?: string | null;
  isCompact?: boolean;
  promoCodeData?: PromoCodeData | null;
  promoCodeSlot?: React.ReactNode;
  promoCodePricing?: {
    plus: { originalPrice: number; discountAmount: number; finalPrice: number };
    pro: { originalPrice: number; discountAmount: number; finalPrice: number };
  } | null;
};

export function PricingPlansGrid({
  onUpgrade,
  isLoading,
  currentPlan,
  isCompact = false,
  promoCodeData,
  promoCodeSlot,
  promoCodePricing,
}: PricingPlansGridProps) {
  if (!isSubscriptionEnabled()) return null;
  const tLanding = useScopedI18n("landing.pricingPlans");
  const tSettings = useScopedI18n("settings");

  const gridClass = isCompact
    ? "grid grid-cols-2 gap-6"
    : "grid grid-cols-1 md:grid-cols-3 gap-16";

  const plusPrice = Number(import.meta.env.VITE_PLUS_PRICE);
  const proPrice = Number(import.meta.env.VITE_PRO_PRICE);

  // Create plan-specific promo code data
  const plusPromoData =
    promoCodeData && promoCodePricing?.plus
      ? {
          ...promoCodeData,
          originalPrice: promoCodePricing.plus.originalPrice,
          discountAmount: promoCodePricing.plus.discountAmount,
          finalPrice: promoCodePricing.plus.finalPrice,
        }
      : null;

  const proPromoData =
    promoCodeData && promoCodePricing?.pro
      ? {
          ...promoCodeData,
          originalPrice: promoCodePricing.pro.originalPrice,
          discountAmount: promoCodePricing.pro.discountAmount,
          finalPrice: promoCodePricing.pro.finalPrice,
        }
      : null;

  return (
    <div className="space-y-6">
      {promoCodeSlot}

      <div className={gridClass}>
        <PricingCard
          planType="plus"
          price={`${plusPrice} ₽`}
          features={[
            tLanding("plans.plus.features.0"),
            tLanding("plans.plus.features.1"),
            tLanding("plans.plus.features.2"),
          ]}
          buttonText={tSettings("upgradeToPlus")}
          onUpgrade={onUpgrade}
          isLoading={isLoading}
          isCurrentPlan={currentPlan === "plus"}
          promoCodeData={plusPromoData}
        />

        <PricingCard
          planType="pro"
          price={`${proPrice} ₽`}
          features={[
            tLanding("plans.pro.features.0"),
            tLanding("plans.pro.features.1"),
            tLanding("plans.pro.features.2"),
            tLanding("plans.pro.features.3"),
          ]}
          buttonText={tSettings("upgradeToPro")}
          onUpgrade={onUpgrade}
          isLoading={isLoading}
          isPopular={true}
          isCurrentPlan={currentPlan === "pro"}
          promoCodeData={proPromoData}
        />
      </div>
    </div>
  );
}
