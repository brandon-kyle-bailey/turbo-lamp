"use server";

import { revalidatePath } from "next/cache";
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
  const result = await availabilityOverridesApi.create(payload);
  revalidatePath("/dashboard/availability/overrides");
  return result;
}

export async function updateOverride(
  id: string,
  data: Partial<AvailabilityOverride>,
) {
  const payload = updateAvailabilityOverrideSchema.parse(data);
  const result = await availabilityOverridesApi.update(id, payload);
  revalidatePath("/dashboard/availability/overrides");
  return result;
}

export async function deleteOverride(id: string) {
  const result = await availabilityOverridesApi.delete(id);
  revalidatePath("/dashboard/availability/overrides");
  return result;
}
