"use server";

import { availabilityOverridesApi } from "@/lib/api/availability-overrides";
import type { AvailabilityOverride } from "@/lib/types";
import {
  createAvailabilityOverrideSchema,
  updateAvailabilityOverrideSchema,
} from "@/lib/schemas";

export async function listOverrides(): Promise<AvailabilityOverride[]> {
  return await availabilityOverridesApi.list();
}

export async function createOverride(data: Partial<AvailabilityOverride>) {
  const payload = createAvailabilityOverrideSchema.parse(data);
  return await availabilityOverridesApi.create(payload);
}

export async function updateOverride(
  id: string,
  data: Partial<AvailabilityOverride>,
) {
  const payload = updateAvailabilityOverrideSchema.parse(data);
  return await availabilityOverridesApi.update(id, payload);
}

export async function deleteOverride(id: string) {
  return await availabilityOverridesApi.delete(id);
}
