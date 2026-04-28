"use server";

import { revalidatePath } from "next/cache";
import { availabilitiesApi } from "@/lib/api/availabilities";
import { availabilitySchema, updateAvailabilitySchema } from "@/lib/schemas";
import { Availability } from "@/lib/types";

export async function updateAvailabilityAction(data: Availability) {
  const activity = availabilitySchema.parse(data);
  const payload = updateAvailabilitySchema.parse(data);
  const result = await availabilitiesApi.update(activity.id!, payload);
  revalidatePath("/dashboard/availability");
  return result;
}
