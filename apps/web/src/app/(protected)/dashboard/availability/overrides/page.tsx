import {
  createOverride,
  deleteOverride,
  listOverrides,
  updateOverride,
} from "./actions";
import OverridesClient from "./overrides-client";

export default async function Page() {
  const initialData = await listOverrides();
  return (
    <OverridesClient
      initialData={initialData}
      actions={{
        createOverrideAction: createOverride,
        updateOverrideAction: updateOverride,
        deleteOverrideAction: deleteOverride,
      }}
    />
  );
}
