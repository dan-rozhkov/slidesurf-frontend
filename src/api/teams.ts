import { apiRequest } from "./client";

/**
 * Thin wrapper that prepends the base URL for team API calls.
 * The existing use-teams.ts hooks already use fetch("/api/teams/...") directly,
 * so this module provides a helper for any new code that needs the base URL.
 */
export async function teamsRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  return apiRequest<T>(path, options);
}
