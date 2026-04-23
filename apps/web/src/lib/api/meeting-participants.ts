import { api } from "./client";
import type { MeetingParticipant } from "@/lib/types";

export const meetingParticipantsApi = {
  list: () => api.get<MeetingParticipant[]>("/meeting-participants"),

  get: (id: string) =>
    api.get<MeetingParticipant>(`/meeting-participants/${id}`),

  create: (data: Partial<MeetingParticipant>) =>
    api.post<MeetingParticipant>("/meeting-participants", data),

  update: (id: string, data: Partial<MeetingParticipant>) =>
    api.put<MeetingParticipant>(`/meeting-participants/${id}`, data),

  delete: (id: string) => api.del<void>(`/meeting-participants/${id}`),
};
