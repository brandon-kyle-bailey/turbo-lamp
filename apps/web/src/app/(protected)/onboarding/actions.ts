"use server";

import { availabilitiesApi } from "@/lib/api/availabilities";
import { availabilityOverridesApi } from "@/lib/api/availability-overrides";
import { calendarsApi } from "@/lib/api/calendars";
import {
  calendarSchema,
  createAvailabilityOverrideSchema,
  createAvailabilitySchema,
} from "@/lib/schemas";
import type { Availability, AvailabilityOverride, Calendar } from "@/lib/types";

export async function saveCalendars(data: Calendar[]) {
  const payload = data.map((calendar) =>
    calendarSchema
      .pick({
        providerId: true,
        externalId: true,
        name: true,
        timezone: true,
        enabled: true,
      })
      .parse({
        providerId: calendar.providerId,
        externalId: calendar.externalId,
        name: calendar.name ?? "Calendar",
        timezone: calendar.timezone ?? "America/Halifax",
        enabled: true,
      }),
  );

  return await calendarsApi.batchUpsert(payload);
}

export async function saveAvailabilities(data: Availability[]) {
  console.log("data:", data);
  const payload = data.map((availability) =>
    createAvailabilitySchema.parse({
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime,
      endTime: availability.endTime,
      isAvailable: availability.isAvailable,
    }),
  );
  console.log("payload:", payload);

  const promises = payload.map((availability) => {
    console.log(availability);
    return availabilitiesApi.create(availability);
  });

  const result = await Promise.all(promises);
  console.log(result);
  return result;
}
export async function saveAvailabilityOverrides(data: AvailabilityOverride[]) {
  const payload = data.map((override) =>
    createAvailabilityOverrideSchema.parse({
      date: override.date,
      startTime: override.startTime,
      endTime: override.endTime,
      isAvailable: override.isAvailable,
    }),
  );

  return await Promise.all(
    payload.map((override) => availabilityOverridesApi.upsert(override)),
  );
}
