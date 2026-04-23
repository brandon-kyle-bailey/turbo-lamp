"use server";

import { availabilityOverridesApi } from "@/lib/api/availability-overrides";
import type { AvailabilityOverride } from "@/lib/types";

export async function listOverrides(): Promise<AvailabilityOverride[]> {
  return await availabilityOverridesApi.list();
}

export async function createOverride(data: Partial<AvailabilityOverride>) {
  return await availabilityOverridesApi.create(data);
}

export async function updateOverride(
  id: string,
  data: Partial<AvailabilityOverride>,
) {
  return await availabilityOverridesApi.update(id, data);
}

export async function deleteOverride(id: string) {
  return await availabilityOverridesApi.delete(id);
}
