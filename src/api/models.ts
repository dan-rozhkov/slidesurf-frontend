import { apiRequest } from "./client";
import type { AIModel } from "@/lib/models";

type ModelsResponse = {
  textModels: AIModel[];
  imageModels: AIModel[];
};

export function getModels(): Promise<ModelsResponse> {
  return apiRequest<ModelsResponse>("/api/models");
}
