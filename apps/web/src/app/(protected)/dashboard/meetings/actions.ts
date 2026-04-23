"use server";

import { meetingsApi } from "@/lib/api/meetings";
import type { Meeting } from "@/lib/types";

export async function listMeetings(): Promise<Meeting[]> {
  return await meetingsApi.list();
}

export async function createMeeting(data: Partial<Meeting>) {
  return await meetingsApi.create(data);
}

export async function updateMeeting(id: string, data: Partial<Meeting>) {
  return await meetingsApi.update(id, data);
}

export async function deleteMeeting(id: string) {
  return await meetingsApi.delete(id);
}
