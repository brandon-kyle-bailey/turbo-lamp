import { registerAction } from "./actions";
import RegisterClient from "./register-client";
export default async function page() {
  return (
    <RegisterClient
      actions={{
        register: registerAction,
      }}
    />
  );
}
