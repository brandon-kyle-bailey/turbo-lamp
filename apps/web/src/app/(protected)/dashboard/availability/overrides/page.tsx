import AvailabilityOverridesClient from "./availability-overrides-client";
import {
  listOverrides,
  createOverride,
  updateOverride,
  deleteOverride,
} from "./actions";

export default async function Page() {
  const data = await listOverrides();

  return (
    <div>
      <AvailabilityOverridesClient
        initialData={data}
        actions={{
          create: createOverride,
          update: updateOverride,
          remove: deleteOverride,
          refresh: listOverrides,
        }}
      />
    </div>
  );
}
