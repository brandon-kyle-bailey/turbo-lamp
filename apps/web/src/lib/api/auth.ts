import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Login, Profile, Register } from "@/lib/types";

const BASE_URL = "http://localhost:3001/api/core/v1";

export const authApi = {
  login: async (data: Login) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      toast.error("Failed to login user.");
    }
  },

  register: async (data: Register) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      toast.error("Failed to register user.");
    }
  },

  profile: async (token?: string): Promise<Profile> => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      redirect("/login");
    }
    return await res.json();
  },
};
