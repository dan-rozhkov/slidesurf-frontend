import { apiRequest } from "./client";
import type { Presentation } from "@/types";

export async function getAll() {
  return apiRequest<Presentation[]>("/api/presentations");
}

export async function getWithTeamShared() {
  return apiRequest<Presentation[]>("/api/presentations/with-shared");
}

export async function getDeleted() {
  return apiRequest<Presentation[]>("/api/presentations/deleted");
}

export async function getSharedWithMe() {
  return apiRequest<Presentation[]>("/api/presentations/shared-with-me");
}

export async function getById(id: string) {
  return apiRequest<Presentation | null>(`/api/presentations/${id}`);
}

export async function create(data: Omit<Presentation, "id">) {
  return apiRequest<Presentation>("/api/presentations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createEmpty() {
  return apiRequest<Presentation>("/api/presentations/empty", {
    method: "POST",
  });
}

export async function update(
  id: string,
  data: Partial<Presentation>,
  withRevalidate = false,
) {
  return apiRequest<Presentation>(`/api/presentations/${id}`, {
    method: "PUT",
    body: JSON.stringify({ ...data, withRevalidate }),
  });
}

export async function toTrash(id: string) {
  return apiRequest<void>(`/api/presentations/${id}/trash`, {
    method: "POST",
  });
}

export async function restore(id: string) {
  return apiRequest<void>(`/api/presentations/${id}/restore`, {
    method: "POST",
  });
}

export async function remove(id: string) {
  return apiRequest<void>(`/api/presentations/${id}`, {
    method: "DELETE",
  });
}

// Re-exports with names expected by components
export {
  create as createPresentation,
  createEmpty as createEmptyPresentation,
  update as updatePresentation,
  remove as deletePresentation,
  restore as restorePresentation,
};
