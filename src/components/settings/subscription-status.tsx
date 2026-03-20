
import { useState } from "react";
import { useScopedI18n } from "@/lib/locales/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";
import { useUserSubscription } from "@/lib/hooks/use-user-subscription";
import { PricingPlansGrid } from "@/components/pricing-plans-grid";
import { PromoCodeInput } from "@/components/promo-code-input";

type PlanPricing = {
  plus: { originalPrice: number; discountAmount: number; finalPrice: number };
  pro: { originalPrice: number; discountAmount: number; finalPrice: number };
};

function SubscriptionStatusSkeleton() {
  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="h-8 w-32 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                <div className="h-5 w-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              </div>
              <div className="h-4 w-48 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type SubscriptionStatusProps = {
  initialPromoCode?: string;
};

export default function SubscriptionStatus({
  initialPromoCode,
}: SubscriptionStatusProps) {
  const t = useScopedI18n("settings");
  const tLanding = useScopedI18n("landing.pricingPlans");
  const [promoCodeInfo, setPromoCodeInfo] = useState<{
    id: string;
    code: string;
    planPricing: PlanPricing;
  } | null>(null);

  // Fetch current subscription using existing hook
  const {
    data: subscription,
    isLoading: loading,
    error,
  } = useUserSubscription();

  if (error) {
    toast.error(error.message || "Failed to fetch subscription");
  }

  // Upgrade subscription mutation
  const upgradeMutation = useMutation({
    mutationFn: async (planType: "plus" | "pro") => {
      // Get promo code data for the selected plan
      const promoCodeData = promoCodeInfo
        ? {
            id: promoCodeInfo.id,
            code: promoCodeInfo.code,
            originalPrice: promoCodeInfo.planPricing[planType].originalPrice,
            discountAmount: promoCodeInfo.planPricing[planType].discountAmount,
            finalPrice: promoCodeInfo.planPricing[planType].finalPrice,
          }
        : null;

      const response = await fetch("/api/subscription/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType,
          promoCode: promoCodeData,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: (data) => {
      // Redirect to payment URL
      if (data.confirmation?.confirmation_url) {
        window.location.href = data.confirmation.confirmation_url;
      }
    },
    onError: (error: Error) => {
      console.error("Error processing subscription:", error);
      toast.error(error.message || "Failed to process subscription");
    },
  });

  const handleUpgrade = (planType: "plus" | "pro") => {
    upgradeMutation.mutate(planType);
  };

  const handlePromoCodeApplied = (data: {
    promoCodeId: string;
    code: string;
    planPricing: PlanPricing;
  }) => {
    setPromoCodeInfo({
      id: data.promoCodeId,
      code: data.code,
      planPricing: data.planPricing,
    });
  };

  const handlePromoCodeRemoved = () => {
    setPromoCodeInfo(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = document.documentElement.lang === "ru" ? ru : enUS;
    return format(date, "dd MMMM yyyy", { locale });
  };

  const getPlanName = (planType: string) => {
    switch (planType) {
      case "plus":
        return tLanding("plans.plus.name");
      case "pro":
        return tLanding("plans.pro.name");
      default:
        return planType;
    }
  };

  if (loading) {
    return <SubscriptionStatusSkeleton />;
  }

  return (
    <>
      <h2 className="text-lg font-bold tracking-tight pt-4">
        {t("currentPlan")}
      </h2>

      <div className="space-y-8">
        {subscription?.isActive ? (
          <div className="space-y-4 bg-background border border-border p-4 pt-3 rounded-lg mt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">
                    {getPlanName(subscription.planType)}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("subscriptionActive")}{" "}
                  {subscription.expiresAt &&
                    formatDate(subscription.expiresAt.toString())}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <p className="text-muted-foreground text-sm">
              {t("noActiveSubscription")}
            </p>
          </div>
        )}

        <hr />

        <PricingPlansGrid
          onUpgrade={handleUpgrade}
          isLoading={upgradeMutation.isPending}
          currentPlan={subscription?.planType}
          promoCodeData={
            promoCodeInfo
              ? {
                  id: promoCodeInfo.id,
                  code: promoCodeInfo.code,
                  originalPrice: 0,
                  discountAmount: 0,
                  finalPrice: 0,
                }
              : null
          }
          promoCodePricing={promoCodeInfo?.planPricing}
          promoCodeSlot={
            <div className="flex justify-start">
              <PromoCodeInput
                onPromoCodeApplied={handlePromoCodeApplied}
                onPromoCodeRemoved={handlePromoCodeRemoved}
                disabled={upgradeMutation.isPending}
                className="text-sm"
                initialCode={initialPromoCode}
              />
            </div>
          }
        />
      </div>
    </>
  );
}
