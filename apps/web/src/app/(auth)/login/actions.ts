"use server";

import { authApi } from "@/lib/api/auth";
import { loginSchema } from "@/lib/schemas";
import { Login as LoginData } from "@/lib/types";

export async function loginAction(data: LoginData) {
  const payload = loginSchema.parse(data);
  return await authApi.login(payload);
}
