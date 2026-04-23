"use server";

import { meetingAttendeesApi } from "@/lib/api/meeting-attendees";
import type { MeetingAttendee } from "@/lib/types";

export async function listMeetingAttendees(): Promise<MeetingAttendee[]> {
  return await meetingAttendeesApi.list();
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
