import { api } from "./client";
import type { Availability } from "@/lib/types";

export const availabilitiesApi = {
  list: () => api.get<Availability[]>("/availabilities"),

  create: (data: Partial<Availability>) =>
    api.post<Availability>("/availabilities", data),

  update: (id: string, data: Partial<Availability>) =>
    api.put<Availability>(`/availabilities/${id}`, data),

  delete: (id: string) => api.del<void>(`/availabilities/${id}`),
};
