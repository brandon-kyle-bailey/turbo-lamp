import { availabilitiesApi } from "@/lib/api/availabilities";
import { updateAvailabilityAction } from "./actions";
import AvailabilityClient from "./availability-client";

export default async function Page() {
  const initialData = await availabilitiesApi.list();
  console.log(initialData);
  return (
    <AvailabilityClient
      initialData={initialData.sort((a, b) => a.dayOfWeek - b.dayOfWeek)}
      actions={{
        update: updateAvailabilityAction,
      }}
    />
  );
}
