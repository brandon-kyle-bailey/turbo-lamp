/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { availabilitiesApi } from "@/lib/api/availabilities";
import { availabilityOverridesApi } from "@/lib/api/availability-overrides";
import { calendarsApi } from "@/lib/api/calendars";
import type { Availability, AvailabilityOverride, Calendar } from "@/lib/types";

export async function saveCalendars(data: Calendar[]) {
  try {
    const payload: Calendar[] = data.map(
      (cal) =>
        ({
          providerId: cal.providerId,
          externalId: cal.externalId,
          name: cal.name ?? "Calendar",
          timezone: cal.timezone ?? "America/Halifax",
          enabled: true,
        }) as Calendar,
    );

    return await calendarsApi.batchUpsert(payload);
  } catch (err: any) {
    console.log(err);
    return;
  }
}

export async function saveAvailabilities(data: Availability[]) {
  try {
    return await Promise.all(
      data.map((a) =>
        availabilitiesApi.upsert({
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
          isEnabled: a.isEnabled,
        }),
      ),
    );
  } catch (err: any) {
    console.log(err);
  }
}
export async function saveAvailabilityOverrides(data: AvailabilityOverride[]) {
  console.log(data);
  try {
    return await Promise.all(
      data.map((o) => {
        const result = availabilityOverridesApi.upsert({
          date: o.date,
          startTime: o.startTime,
          endTime: o.endTime,
          isAvailable: o.isAvailable,
        });
        return result;
      }),
    );
  } catch (err: any) {
    console.log(err);
  }
}
