import { api } from "./client";
import type { AvailabilityOverride } from "@/lib/types";

export const availabilityOverridesApi = {
  get: (id: string) =>
    api.get<AvailabilityOverride>(`/availability-overrides/${id}`),

  list: () => api.get<AvailabilityOverride[]>("/availability-overrides"),

  create: (data: Partial<AvailabilityOverride>) =>
    api.post<AvailabilityOverride>("/availability-overrides", data),

  upsert: (data: Partial<AvailabilityOverride>) =>
    api.post<AvailabilityOverride>("/availability-overrides/upsert", data),

  update: (id: string, data: Partial<AvailabilityOverride>) =>
    api.patch<AvailabilityOverride>(`/availability-overrides/${id}`, data),

  delete: (id: string) => api.del<void>(`/availability-overrides/${id}`),
};
