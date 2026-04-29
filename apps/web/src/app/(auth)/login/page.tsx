import { cookies } from "next/headers";
import { loginAction } from "./actions";
import LoginClient from "./login-client";
import { redirect } from "next/navigation";
export default async function Page() {
  const session = (await cookies()).get("session");
  if (session) {
    return redirect("/dashboard");
  }
  return (
    <LoginClient
      actions={{
        login: loginAction,
      }}
    />
  );
}
