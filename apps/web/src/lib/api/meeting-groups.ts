import { api } from "./client";
import type { MeetingGroup } from "@/lib/types";

export const meetingGroupsApi = {
  list: () => api.get<MeetingGroup[]>("/meeting-groups"),
  error: () => api.get<MeetingGroup[]>("/blah"),

  get: (id: string) => api.get<MeetingGroup>(`/meeting-groups/${id}`),

  create: (data: Partial<MeetingGroup>) =>
    api.post<MeetingGroup>("/meeting-groups", data),

  update: (id: string, data: Partial<MeetingGroup>) =>
    api.put<MeetingGroup>(`/meeting-groups/${id}`, data),

  delete: (id: string) => api.del<void>(`/meeting-groups/${id}`),
};
