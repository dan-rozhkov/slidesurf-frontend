import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Theme } from "@/types";

type UseThemeReturn = {
  theme: Theme | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
};

const fetchTheme = async (themeId: string): Promise<Theme> => {
  const response = await apiFetch(`/api/themes/${themeId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch theme");
  }
  const data = await response.json();
  return data.theme;
};

export function useTheme(themeId: string | null): UseThemeReturn {
  const {
    data: theme,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["theme", themeId],
    queryFn: () => fetchTheme(themeId!),
    enabled: !!themeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  return {
    theme: theme || null,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
