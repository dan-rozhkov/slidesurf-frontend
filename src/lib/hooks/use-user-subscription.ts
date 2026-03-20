import { useQuery } from "@tanstack/react-query";
import { getUserSubscription } from "@/api/subscription";
import type { ActiveSubscription } from "@/types";
import { getSubscriptionLimits } from "@/lib/subscription-limits";
import { isSubscriptionEnabled } from "@/lib/subscription-utils";

export type UseUserSubscriptionOptions = {
  enabled?: boolean;
};

export function useUserSubscription(options?: UseUserSubscriptionOptions) {
  return useQuery<ActiveSubscription | null>({
    queryKey: ["user-subscription"],
    queryFn: async (): Promise<ActiveSubscription | null> => {
      if (!isSubscriptionEnabled()) {
        return {
          planType: "pro",
          isActive: true,
          expiresAt: null,
          limits: getSubscriptionLimits("pro"),
        };
      }

      const result = await getUserSubscription();
      if (!result) return null;
      return {
        planType: result.plan,
        isActive: result.status === "active",
        expiresAt: null,
        limits: getSubscriptionLimits(result.plan),
      };
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
