import { availabilitiesApi } from "@/lib/api/availabilities";
import { availabilityOverridesApi } from "@/lib/api/availability-overrides";
import { calendarsApi } from "@/lib/api/calendars";
import OnboardingClient from "./onboarding-client";

import {
  saveAvailabilities,
  saveAvailabilityOverrides,
  saveCalendars,
} from "./actions";

export default async function Page() {
  const [externalCalendars, calendars, availabilities, overrides] =
    await Promise.all([
      calendarsApi.listExternal(),
      calendarsApi.list(),
      availabilitiesApi.list(),
      availabilityOverridesApi.list(),
    ]);

  return (
    <OnboardingClient
      externalCalendars={externalCalendars}
      calendars={calendars}
      availabilities={availabilities}
      overrides={overrides}
      saveCalendarsAction={saveCalendars}
      saveAvailabilitiesAction={saveAvailabilities}
      saveAvailabilityOverridesAction={saveAvailabilityOverrides}
    />
  );
}
