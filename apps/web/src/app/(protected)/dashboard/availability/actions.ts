"use server";

import { availabilitiesApi } from "@/lib/api/availabilities";
import { availabilitySchema, updateAvailabilitySchema } from "@/lib/schemas";
import { Availability } from "@/lib/types";

export async function updateAvailabilityAction(data: Availability) {
  const activity = availabilitySchema.parse(data);
  const payload = updateAvailabilitySchema.parse(data);
  console.log(payload);
  return await availabilitiesApi.update(activity.id!, payload);
}
