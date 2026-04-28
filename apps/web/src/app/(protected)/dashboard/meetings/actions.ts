"use server";

import { revalidatePath } from "next/cache";
import { meetingsApi } from "@/lib/api/meetings";
import type { Meeting } from "@/lib/types";

export async function listMeetings(): Promise<Meeting[]> {
  return await meetingsApi.list();
}

export async function createMeeting(data: Partial<Meeting>) {
  const result = await meetingsApi.create(data);
  revalidatePath("/dashboard/meetings");
  return result;
}

export async function updateMeeting(id: string, data: Partial<Meeting>) {
  const result = await meetingsApi.update(id, data);
  revalidatePath("/dashboard/meetings");
  return result;
}

export async function deleteMeeting(id: string) {
  const result = await meetingsApi.delete(id);
  revalidatePath("/dashboard/meetings");
  return result;
}
