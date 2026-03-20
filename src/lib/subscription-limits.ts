import type { SubscriptionLimits } from "@/types";

export const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    planType: "free",
    maxSlidesPerGeneration: 8,
    maxGenerationsPerDay: 3,
    maxGenerationsPerMonth: 3,
    canUseAdvancedModels: false,
    canUseAdvancedImageModels: false,
    canUseImageGeneration: true,
    canUseChartGeneration: true,
    canUseCustomThemes: false,
    maxAttachmentsPerGeneration: 1,
  },
  plus: {
    planType: "plus",
    maxSlidesPerGeneration: 15,
    maxGenerationsPerDay: 20,
    maxGenerationsPerMonth: 100,
    canUseAdvancedModels: true,
    canUseAdvancedImageModels: false,
    canUseImageGeneration: true,
    canUseChartGeneration: true,
    canUseCustomThemes: false,
    maxAttachmentsPerGeneration: 3,
  },
  pro: {
    planType: "pro",
    maxSlidesPerGeneration: 60,
    maxGenerationsPerDay: 50,
    maxGenerationsPerMonth: 500,
    canUseAdvancedModels: true,
    canUseAdvancedImageModels: true,
    canUseImageGeneration: true,
    canUseChartGeneration: true,
    canUseCustomThemes: true,
    maxAttachmentsPerGeneration: 10,
  },
};

export function getSubscriptionLimits(planType: string): SubscriptionLimits {
  return SUBSCRIPTION_LIMITS[planType] ?? SUBSCRIPTION_LIMITS["free"]!;
}
