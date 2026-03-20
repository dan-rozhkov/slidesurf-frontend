
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/lib/locales/client";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { isSubscriptionEnabled } from "@/lib/subscription-utils";

type ButtonAction =
  | {
      type: "link";
      href: string;
    }
  | {
      type: "function";
      onClick: () => void;
    };

type PricingPlan = {
  name: string;
  badge: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  buttonText: string;
  buttonAction?: ButtonAction;
  isPopular?: boolean;
};

type PricingGridProps = {
  className?: string;
  plans?: PricingPlan[];
};

const PricingGrid = ({
  className = "",
  plans: customPlans,
}: PricingGridProps) => {
  if (!isSubscriptionEnabled()) return null;
  const t = useScopedI18n("landing.pricingPlans");

  const plusPrice = Number(import.meta.env.VITE_PLUS_PRICE);
  const proPrice = Number(import.meta.env.VITE_PRO_PRICE);

  const defaultPlans: PricingPlan[] = [
    {
      name: t("plans.free.name"),
      badge: t("plans.free.badge"),
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        t("plans.free.features.0"),
        t("plans.free.features.1"),
        t("plans.free.features.2"),
        t("plans.free.features.3"),
      ],
      buttonText: t("plans.free.buttonText"),
      buttonAction: { type: "link", href: "/dashboard" },
    },
    {
      name: t("plans.plus.name"),
      badge: t("plans.plus.badge"),
      monthlyPrice: plusPrice,
      yearlyPrice: plusPrice * 10,
      features: [
        t("plans.plus.features.0"),
        t("plans.plus.features.1"),
        t("plans.plus.features.2"),
      ],
      buttonText: t("plans.plus.buttonText"),
      buttonAction: { type: "link", href: "/dashboard" },
      isPopular: true,
    },
    {
      name: t("plans.pro.name"),
      badge: t("plans.pro.badge"),
      monthlyPrice: proPrice,
      yearlyPrice: proPrice * 10,
      features: [
        t("plans.pro.features.0"),
        t("plans.pro.features.1"),
        t("plans.pro.features.2"),
        t("plans.pro.features.3"),
      ],
      buttonText: t("plans.pro.buttonText"),
      buttonAction: { type: "link", href: "/dashboard" },
    },
  ];

  const plans = customPlans || defaultPlans;

  return (
    <section className={className}>
      <div className="container px-4 sm:px-6 lg:px-0">
        <div className="flex w-full flex-col items-stretch gap-4 sm:gap-6 md:flex-row">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex w-full flex-col rounded-xl border border-border p-4 sm:p-6 text-left gap-4 sm:gap-6",
                plan.isPopular ? "bg-white/5" : ""
              )}
            >
              {plan.isPopular && (
                <div className="bg-gradient-to-r from-pink-500 to-orange-400 absolute -top-6 inset-x-0 h-10 rounded-t-xl text-white text-center flex items-center justify-center font-bold">
                  {t("popular")}
                </div>
              )}

              <p className="text-3xl font-semibold tracking-tight">
                {plan.badge}
              </p>
              <div className="flex items-top gap-2">
                <p className="text-5xl font-semibold tracking-tight">
                  {plan.monthlyPrice} ₽
                </p>
                <p
                  className={`text-muted lowercase opacity-80 ${
                    plan.monthlyPrice === 0 ? "invisible" : ""
                  }`}
                >
                  / {t("perMonth")}
                </p>
              </div>
              <div className="flex h-full flex-col justify-between gap-20">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="size-4" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.buttonAction?.type === "link" ? (
                  <Button
                    asChild
                    className={cn(
                      "text-white focus:outline-none rounded-full text-center sm:px-6 sm:py-3 py-2 px-4 sm:text-md text-sm h-auto font-bold",
                      plan.isPopular
                        ? "bg-gradient-to-r from-pink-500 to-orange-400"
                        : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <Link to={plan.buttonAction.href}>{plan.buttonText}</Link>
                  </Button>
                ) : (
                  <Button
                    onClick={plan.buttonAction?.onClick}
                    className={cn(
                      "text-white focus:outline-none rounded-full text-center sm:px-6 sm:py-3 py-2 px-4 sm:text-md text-sm h-auto font-bold",
                      plan.isPopular
                        ? "bg-gradient-to-r from-pink-500 to-orange-400"
                        : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    {plan.buttonText}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { PricingGrid };
