import { headers as nextHeaders } from "next/headers";

const BASE_URL = "http://localhost:3001/api/core/v1";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(
  path: string,
  method: HttpMethod = "GET",
  body?: unknown,
  headers: HeadersInit = {},
): Promise<T> {
  const headerStore = await nextHeaders();

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Cookie: headerStore.get("cookie") ?? "",
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new ApiError(res.status, error);
  }

  return res.json();
}

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(status: number, details: unknown) {
    super("API request failed");
    this.status = status;
    this.details = details;
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body: unknown) => request<T>(path, "POST", body),
  put: <T>(path: string, body: unknown) => request<T>(path, "PUT", body),
  del: <T>(path: string) => request<T>(path, "DELETE"),
};
