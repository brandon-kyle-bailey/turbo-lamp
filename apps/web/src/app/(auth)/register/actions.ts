"use server";

import { authApi } from "@/lib/api/auth";
import { registerSchema } from "@/lib/schemas";
import { Register as RegisterData } from "@/lib/types";

export async function registerAction(data: RegisterData) {
  const payload = registerSchema.parse(data);
  return await authApi.register(payload);
}
