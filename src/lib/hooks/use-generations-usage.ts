import { useQuery } from "@tanstack/react-query";
import { getGenerationsUsage } from "@/api/subscription";

export type GenerationsUsage = {
  used: number;
  limit: number;
  remaining: number;
};

export type UseGenerationsUsageOptions = {
  enabled?: boolean;
};

export function useGenerationsUsage(options?: UseGenerationsUsageOptions) {
  return useQuery<GenerationsUsage | null>({
    queryKey: ["generations-usage"],
    queryFn: async () => {
      const result = await getGenerationsUsage();
      return result || null;
    },
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
