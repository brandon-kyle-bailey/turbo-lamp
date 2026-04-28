import { Login, Profile, Register } from "@/lib/types";
import { serverRequest } from "@/lib/api/client";
import { loginSchema, registerSchema } from "@/lib/schemas";

export const authApi = {
  login: async (data: Login) => {
    const payload = loginSchema.parse(data);
    return await serverRequest<Profile>("/auth/login", "POST", payload);
  },

  register: async (data: Register) => {
    const payload = registerSchema.parse(data);
    return await serverRequest<Profile>("/auth/register", "POST", payload);
  },

  profile: async () => {
    return await serverRequest<Profile>("/users/profile", "GET");
  },
};
