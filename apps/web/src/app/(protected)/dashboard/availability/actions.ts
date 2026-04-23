"use server";

import { availabilitiesApi } from "@/lib/api/availabilities";
import type { Availability } from "@/lib/types";

export async function listAvailabilities(): Promise<Availability[]> {
  return await availabilitiesApi.list();
}

export async function createAvailability(data: Partial<Availability>) {
  return await availabilitiesApi.create(data);
}

export async function updateAvailability(
  id: string,
  data: Partial<Availability>,
) {
  return await availabilitiesApi.update(id, data);
}

export async function deleteAvailability(id: string) {
  return await availabilitiesApi.delete(id);
}
