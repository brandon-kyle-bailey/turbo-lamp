import AvailabilitiesClient from "./availabilities-client";
import {
  listAvailabilities,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "./actions";

export default async function Page() {
  const data = await listAvailabilities();

  return (
    <div className="p-6">
      <AvailabilitiesClient
        initialData={data}
        actions={{
          create: createAvailability,
          update: updateAvailability,
          remove: deleteAvailability,
          refresh: listAvailabilities,
        }}
      />
    </div>
  );
}
