import AvailabilitiesClient from "./availabilities-client";
import {
  listAvailabilities,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "./actions";
import AvailabilityCalendar from "./availabilities-client";

export default async function Page() {
  const data = await listAvailabilities();

  return (
    <div>
      <AvailabilityCalendar
        initialData={data}
        actions={{
          create: createAvailability,
          update: updateAvailability,
          remove: deleteAvailability,
          list: listAvailabilities,
        }}
      />
    </div>
  );
}
