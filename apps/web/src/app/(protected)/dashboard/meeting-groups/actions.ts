"use server";

import { meetingGroupsApi } from "@/lib/api/meeting-groups";
import type { MeetingGroup } from "@/lib/types";
import {
  createMeetingGroupSchema,
  updateMeetingGroupSchema,
} from "@/lib/schemas";

export async function listMeetingGroups(): Promise<MeetingGroup[]> {
  return await meetingGroupsApi.list();
}

export async function createMeetingGroup(data: Partial<MeetingGroup>) {
  const payload = createMeetingGroupSchema.parse(data);
  return await meetingGroupsApi.create(payload);
}

export async function updateMeetingGroup(
  id: string,
  data: Partial<MeetingGroup>,
) {
  const payload = updateMeetingGroupSchema.parse(data);
  return await meetingGroupsApi.update(id, payload);
}

export async function deleteMeetingGroup(id: string) {
  return await meetingGroupsApi.delete(id);
}
