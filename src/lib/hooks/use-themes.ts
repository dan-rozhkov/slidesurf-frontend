import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Theme } from "@/types";

type UseThemesReturn = {
  themes: Theme[];
  userThemes: Theme[];
  isLoading: boolean;
  error: Error | null;
  createTheme: (themeData: Omit<Theme, "id">) => Promise<Theme | null>;
  updateTheme: (
    themeId: string,
    themeData: Partial<Theme>
  ) => Promise<Theme | null>;
  deleteTheme: (themeId: string) => Promise<boolean>;
  setThemeVisibility: (
    themeId: string,
    isPublic: boolean
  ) => Promise<Theme | null>;
  refreshThemes: () => Promise<unknown>;
};

const fetchThemes = async (): Promise<Theme[]> => {
  const response = await apiFetch("/api/themes");
  if (!response.ok) {
    throw new Error("Failed to fetch themes");
  }
  const data = await response.json();
  return data.themes;
};

const fetchUserThemes = async (): Promise<Theme[]> => {
  const response = await apiFetch("/api/themes/user");
  if (!response.ok) {
    // User might not be authenticated, which is fine
    return [];
  }
  const data = await response.json();
  return data.themes;
};

const createThemeMutation = async (
  themeData: Omit<Theme, "id">
): Promise<Theme> => {
  const response = await apiFetch("/api/themes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(themeData),
  });

  if (!response.ok) {
    throw new Error("Failed to create theme");
  }

  const data = await response.json();
  return data.theme;
};

const updateThemeMutation = async ({
  themeId,
  themeData,
}: {
  themeId: string;
  themeData: Partial<Theme>;
}): Promise<Theme> => {
  const response = await apiFetch(`/api/themes/${themeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(themeData),
  });

  if (!response.ok) {
    throw new Error("Failed to update theme");
  }

  const data = await response.json();
  return data.theme;
};

const deleteThemeMutation = async (themeId: string): Promise<boolean> => {
  const response = await apiFetch(`/api/themes/${themeId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete theme");
  }

  return true;
};

const setThemeVisibilityMutation = async ({
  themeId,
  isPublic,
}: {
  themeId: string;
  isPublic: boolean;
}): Promise<Theme> => {
  const response = await apiFetch(`/api/themes/${themeId}/visibility`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isPublic }),
  });

  if (!response.ok) {
    throw new Error("Failed to update theme visibility");
  }

  const data = await response.json();
  return data.theme;
};

export function useThemes(): UseThemesReturn {
  const queryClient = useQueryClient();

  // Queries
  const {
    data: themes = [],
    isLoading: themesLoading,
    error: themesError,
    refetch: refetchThemes,
  } = useQuery({
    queryKey: ["themes"],
    queryFn: fetchThemes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const {
    data: userThemes = [],
    isLoading: userThemesLoading,
    error: userThemesError,
    refetch: refetchUserThemes,
  } = useQuery({
    queryKey: ["user-themes"],
    queryFn: fetchUserThemes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutations
  const createThemeMutationFn = useMutation({
    mutationFn: createThemeMutation,
    onSuccess: () => {
      // Invalidate and refetch both queries
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["user-themes"] });
    },
  });

  const updateThemeMutationFn = useMutation({
    mutationFn: updateThemeMutation,
    onSuccess: () => {
      // Invalidate and refetch both queries
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["user-themes"] });
    },
  });

  const deleteThemeMutationFn = useMutation({
    mutationFn: deleteThemeMutation,
    onSuccess: () => {
      // Invalidate and refetch both queries
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["user-themes"] });
    },
  });

  const setThemeVisibilityMutationFn = useMutation({
    mutationFn: setThemeVisibilityMutation,
    onSuccess: () => {
      // Invalidate and refetch both queries
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["user-themes"] });
    },
  });

  const createTheme = async (
    themeData: Omit<Theme, "id">
  ): Promise<Theme | null> => {
    try {
      return await createThemeMutationFn.mutateAsync(themeData);
    } catch (error) {
      console.error("Failed to create theme:", error);
      return null;
    }
  };

  const updateTheme = async (
    themeId: string,
    themeData: Partial<Theme>
  ): Promise<Theme | null> => {
    try {
      return await updateThemeMutationFn.mutateAsync({ themeId, themeData });
    } catch (error) {
      console.error("Failed to update theme:", error);
      return null;
    }
  };

  const deleteTheme = async (themeId: string): Promise<boolean> => {
    try {
      return await deleteThemeMutationFn.mutateAsync(themeId);
    } catch (error) {
      console.error("Failed to delete theme:", error);
      return false;
    }
  };

  const setThemeVisibility = async (
    themeId: string,
    isPublic: boolean
  ): Promise<Theme | null> => {
    try {
      return await setThemeVisibilityMutationFn.mutateAsync({
        themeId,
        isPublic,
      });
    } catch (error) {
      console.error("Failed to update theme visibility:", error);
      return null;
    }
  };

  const refreshThemes = async () => {
    await Promise.all([refetchThemes(), refetchUserThemes()]);
  };

  return {
    themes,
    userThemes,
    isLoading: themesLoading || userThemesLoading,
    error: (themesError || userThemesError) as Error | null,
    createTheme,
    updateTheme,
    deleteTheme,
    setThemeVisibility,
    refreshThemes,
  };
}
