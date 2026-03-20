
import { useState } from "react";
import { useSubscriptionDialog } from "@/lib/hooks/use-subscription-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useScopedI18n } from "@/lib/locales/client";
import { Zap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { PricingPlansGrid } from "@/components/pricing-plans-grid";
import { PromoCodeInput } from "@/components/promo-code-input";

type PlanPricing = {
  plus: { originalPrice: number; discountAmount: number; finalPrice: number };
  pro: { originalPrice: number; discountAmount: number; finalPrice: number };
};

export function SubscriptionDialog() {
  const [isOpen, setIsOpen] = useSubscriptionDialog();
  const t = useScopedI18n("subscription");
  const [promoCodeInfo, setPromoCodeInfo] = useState<{
    id: string;
    code: string;
    planPricing: PlanPricing;
  } | null>(null);

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <DialogTitle>{t("limitReached") || "Limit Reached"}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {t("limitReachedDescription") ||
              "You've reached your subscription limit. Upgrade your plan to continue generating presentations."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <PricingPlansGrid
            onUpgrade={handleUpgrade}
            isLoading={upgradeMutation.isPending}
            isCompact={true}
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
              <div className="flex justify-center pb-2">
                <PromoCodeInput
                  onPromoCodeApplied={handlePromoCodeApplied}
                  onPromoCodeRemoved={handlePromoCodeRemoved}
                  disabled={upgradeMutation.isPending}
                  className="w-full text-sm"
                />
              </div>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
