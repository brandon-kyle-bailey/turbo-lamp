import { loginAction } from "./actions";
import LoginClient from "./login-client";
export default async function page() {
  return (
    <LoginClient
      actions={{
        login: loginAction,
      }}
    />
  );
}
