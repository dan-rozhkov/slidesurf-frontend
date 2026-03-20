import { apiRequest } from "./client";

type Subscription = {
  plan: string;
  status: string;
  limits: {
    maxGenerationsPerMonth: number;
  };
};

type GenerationsUsage = {
  used: number;
  limit: number;
  remaining: number;
};

export async function getUserSubscription() {
  return apiRequest<Subscription | null>("/api/subscription/current");
}

export async function getGenerationsUsage() {
  return apiRequest<GenerationsUsage | null>("/api/subscription/usage");
}

export async function revalidate(_path?: string) {
  // No-op in SPA - server revalidation not applicable
}
