import { api } from "./client";
import type { AvailabilityOverride } from "@/lib/types";

export const availabilityOverridesApi = {
  list: () => api.get<AvailabilityOverride[]>("/availability-overrides"),

  create: (data: Partial<AvailabilityOverride>) =>
    api.post<AvailabilityOverride>("/availability-overrides", data),

  update: (id: string, data: Partial<AvailabilityOverride>) =>
    api.put<AvailabilityOverride>(`/availability-overrides/${id}`, data),

  delete: (id: string) => api.del<void>(`/availability-overrides/${id}`),
};
