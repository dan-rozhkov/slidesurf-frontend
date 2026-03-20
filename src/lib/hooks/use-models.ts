import { useQuery } from "@tanstack/react-query";
import { getModels } from "@/api/models";
import type { AIModel } from "@/lib/models";

type ModelsData = {
  textModels: AIModel[];
  imageModels: AIModel[];
};

export function useModels() {
  const query = useQuery<ModelsData>({
    queryKey: ["models"],
    queryFn: getModels,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    textModels: query.data?.textModels ?? [],
    imageModels: query.data?.imageModels ?? [],
    isLoading: query.isLoading,
  };
}
