import { api } from "./client";
import type { Meeting } from "@/lib/types";

export const meetingsApi = {
  list: () => api.get<Meeting[]>("/meetings"),

  get: (id: string) => api.get<Meeting>(`/meetings/${id}`),

  create: (data: Partial<Meeting>) => api.post<Meeting>("/meetings", data),

  update: (id: string, data: Partial<Meeting>) =>
    api.patch<Meeting>(`/meetings/${id}`, data),

  delete: (id: string) => api.del<void>(`/meetings/${id}`),
};
