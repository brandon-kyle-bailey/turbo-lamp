import { Login, Profile, Register } from "@/lib/types";
import { ApiError } from "./client";

const BASE_URL = "http://localhost:3001/api/core/v1";

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}

function toApiError(status: number, payload: unknown): ApiError {
  const body =
    payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const message =
    typeof body.message === "string" ? body.message : "API request failed";
  const code = typeof body.code === "string" ? body.code : undefined;
  const details = "details" in body ? body.details : payload;
  return new ApiError(status, details, message, code);
}

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
    const payload = await parseJsonSafe(res);
    if (!res.ok) {
      throw toApiError(res.status, payload);
    }

    return payload;
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
    const payload = await parseJsonSafe(res);
    if (!res.ok) {
      throw toApiError(res.status, payload);
    }

    return payload;
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
    const payload = await parseJsonSafe(res);
    if (!res.ok) {
      throw toApiError(res.status, payload);
    }

    return payload as Profile;
  },
};
