"use server";

import { meetingGroupsApi } from "@/lib/api/meeting-groups";
import type { MeetingGroup } from "@/lib/types";

export async function listMeetingGroups(): Promise<MeetingGroup[]> {
  return await meetingGroupsApi.list();
}

export async function createMeetingGroup(data: Partial<MeetingGroup>) {
  return await meetingGroupsApi.create(data);
}

export async function updateMeetingGroup(
  id: string,
  data: Partial<MeetingGroup>,
) {
  return await meetingGroupsApi.update(id, data);
}

export async function deleteMeetingGroup(id: string) {
  return await meetingGroupsApi.delete(id);
}
