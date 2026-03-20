
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScopedI18n } from "@/lib/locales/client";
import { Loader, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/api/client";

type PlanPricing = {
  plus: { originalPrice: number; discountAmount: number; finalPrice: number };
  pro: { originalPrice: number; discountAmount: number; finalPrice: number };
};

type PromoCodeInputProps = {
  onPromoCodeApplied: (data: {
    promoCodeId: string;
    code: string;
    planPricing: PlanPricing;
  }) => void;
  onPromoCodeRemoved: () => void;
  disabled?: boolean;
  className?: string;
  initialCode?: string;
};

export function PromoCodeInput({
  onPromoCodeApplied,
  onPromoCodeRemoved,
  disabled = false,
  className,
  initialCode,
}: PromoCodeInputProps) {
  const t = useScopedI18n("promoCode");
  const [code, setCode] = useState(initialCode?.toUpperCase() || "");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<{
    code: string;
    planPricing: PlanPricing;
  } | null>(null);
  const [showInput, setShowInput] = useState(false);
  const hasAutoValidated = useRef(false);

  const validateCode = useCallback(
    async (codeToValidate: string) => {
      if (!codeToValidate.trim()) {
        setError(t("errors.emptyCode"));
        return;
      }

      setIsValidating(true);
      setError(null);

      try {
        // Validate for both plans
        const [plusResponse, proResponse] = await Promise.all([
          apiFetch("/api/promo-code/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: codeToValidate.toUpperCase(),
              planType: "plus",
            }),
          }),
          apiFetch("/api/promo-code/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: codeToValidate.toUpperCase(),
              planType: "pro",
            }),
          }),
        ]);

        const plusData = await plusResponse.json();
        const proData = await proResponse.json();

        // Check if at least one plan accepts the promo code
        if (!plusResponse.ok && !proResponse.ok) {
          setError(plusData.error || proData.error || t("errors.serverError"));
          return;
        }

        const planPricing: PlanPricing = {
          plus: plusResponse.ok
            ? {
                originalPrice: plusData.pricing.originalPrice,
                discountAmount: plusData.pricing.discountAmount,
                finalPrice: plusData.pricing.finalPrice,
              }
            : {
                originalPrice: Number(import.meta.env.VITE_PLUS_PRICE),
                discountAmount: 0,
                finalPrice: Number(import.meta.env.VITE_PLUS_PRICE),
              },
          pro: proResponse.ok
            ? {
                originalPrice: proData.pricing.originalPrice,
                discountAmount: proData.pricing.discountAmount,
                finalPrice: proData.pricing.finalPrice,
              }
            : {
                originalPrice: Number(import.meta.env.VITE_PRO_PRICE),
                discountAmount: 0,
                finalPrice: Number(import.meta.env.VITE_PRO_PRICE),
              },
        };

        const promoCodeId = plusResponse.ok
          ? plusData.promoCode.id
          : proData.promoCode.id;

        setAppliedPromoCode({
          code: codeToValidate.toUpperCase(),
          planPricing,
        });
        setShowInput(false);
        onPromoCodeApplied({
          promoCodeId,
          code: codeToValidate.toUpperCase(),
          planPricing,
        });
      } catch (err) {
        console.error("Error validating promo code:", err);
        setError(t("errors.serverError"));
      } finally {
        setIsValidating(false);
      }
    },
    [onPromoCodeApplied, t]
  );

  // Auto-validate initial code on mount
  useEffect(() => {
    if (initialCode && !hasAutoValidated.current) {
      hasAutoValidated.current = true;
      validateCode(initialCode);
    }
  }, [initialCode, validateCode]);

  const handleValidate = async () => {
    await validateCode(code);
  };

  const handleRemove = () => {
    setAppliedPromoCode(null);
    setCode("");
    setError(null);
    setShowInput(false);
    onPromoCodeRemoved();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleValidate();
    }
  };

  if (appliedPromoCode) {
    return (
      <div className={cn("flex items-center", className)}>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {t("applied")}: {appliedPromoCode.code}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleRemove}
          disabled={disabled}
          className="h-auto p-1 ml-1 text-muted-foreground"
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  if (!showInput) {
    return (
      <div
        role="button"
        onClick={() => setShowInput(true)}
        className={cn("gap-3 flex items-center hover:underline", className)}
      >
        <Tag className="w-4 h-4" />
        {t("havePromoCode")}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        <Input
          autoFocus
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder")}
          disabled={disabled || isValidating}
          className="uppercase"
        />
        <Button
          type="button"
          onClick={handleValidate}
          disabled={disabled || isValidating || !code.trim()}
        >
          {isValidating && <Loader className="w-4 h-4 animate-spin" />}
          {t("apply")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            setShowInput(false);
            setCode("");
            setError(null);
          }}
          disabled={disabled || isValidating}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
