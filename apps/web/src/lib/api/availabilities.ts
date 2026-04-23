import { api } from "./client";
import type { Availability } from "@/lib/types";

export const availabilitiesApi = {
  get: (id: string) => api.get<Availability>(`/availabilities/${id}`),

  list: () => api.get<Availability[]>("/availabilities"),

  upsert: (data: Partial<Availability>) =>
    api.post<Availability>("/availabilities/upsert", data),

  create: (data: Partial<Availability>) =>
    api.post<Availability>("/availabilities", data),

  update: (id: string, data: Partial<Availability>) =>
    api.patch<Availability>(`/availabilities/${id}`, data),

  delete: (id: string) => api.del<void>(`/availabilities/${id}`),
};
