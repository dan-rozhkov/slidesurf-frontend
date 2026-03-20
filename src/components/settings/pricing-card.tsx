
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/lib/locales/client";
import { Check, Loader } from "lucide-react";

type PromoCodeData = {
  id: string;
  code: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
};

type PricingCardProps = {
  planType: "plus" | "pro";
  price: string;
  features: string[];
  buttonText: string;
  onUpgrade: (planType: "plus" | "pro") => void;
  isLoading: boolean;
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  promoCodeData?: PromoCodeData | null;
};

export default function PricingCard({
  planType,
  price,
  features,
  buttonText,
  onUpgrade,
  isLoading,
  isPopular = false,
  isCurrentPlan = false,
  promoCodeData,
}: PricingCardProps) {
  const tLanding = useScopedI18n("landing.pricingPlans");
  const tSettings = useScopedI18n("settings");

  const getPlanName = () => {
    switch (planType) {
      case "plus":
        return tLanding("plans.plus.name");
      case "pro":
        return tLanding("plans.pro.name");
      default:
        return planType;
    }
  };

  const getButtonStyle = () => {
    if (planType === "pro") {
      return "w-full bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500";
    }
    return "w-full";
  };

  // Calculate displayed price based on promo code
  const originalPriceNum = parseFloat(price.replace(/[^\d.]/g, ""));
  const hasPromoCode =
    promoCodeData && promoCodeData.originalPrice === originalPriceNum;
  const displayPrice = hasPromoCode
    ? promoCodeData.finalPrice
    : originalPriceNum;

  return (
    <div className="flex flex-col gap-4 justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-semibold">{getPlanName()}</h4>
          {isPopular && (
            <span className="bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-bold">
              {tLanding("popular")}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          {hasPromoCode && (
            <p className="text-muted-foreground line-through">
              {originalPriceNum} ₽
            </p>
          )}
          <p className={`font-semibold tracking-tight text-4xl`}>
            {displayPrice} ₽
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          / {tLanding("perMonth")}
        </p>

        <ul className="space-y-2 text-sm py-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="size-4 text-muted-foreground" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button
        onClick={() => onUpgrade(planType)}
        disabled={isLoading || isCurrentPlan}
        className={getButtonStyle()}
      >
        {isLoading && <Loader className="size-4 animate-spin mr-2" />}
        {isCurrentPlan ? tSettings("currentPlanButton") : buttonText}
      </Button>
    </div>
  );
}
