"use server";

import { meetingAttendeesApi } from "@/lib/api/meeting-attendees";
import type { MeetingAttendee } from "@/lib/types";

export async function listMeetingAttendees(): Promise<MeetingAttendee[]> {
  const paginated = await meetingAttendeesApi.list({ page: 1, perPage: 100 });
  return paginated.data;
}

export async function createMeetingAttendees(data: Partial<MeetingAttendee>) {
  return await meetingAttendeesApi.create(data);
}

export async function updateMeetingAttendees(
  id: string,
  data: Partial<MeetingAttendee>,
) {
  return await meetingAttendeesApi.update(id, data);
}

export async function deleteMeetingAttendees(id: string) {
  return await meetingAttendeesApi.delete(id);
}
