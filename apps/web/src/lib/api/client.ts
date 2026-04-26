import { headers as nextHeaders } from "next/headers";

const BASE_URL = "http://localhost:3001/api/core/v1";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiEnvelope<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

type ApiErrorBody = {
  message?: string;
  code?: string;
  details?: unknown;
};

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return Boolean(
    value && typeof value === "object" && "data" in (value as object),
  );
}

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

  const payload = await parseJsonSafe(res);

  if (!res.ok) {
    const error = (payload ?? {}) as ApiErrorBody;
    throw new ApiError(
      res.status,
      error.details,
      error.message ?? "API request failed",
      error.code,
    );
  }

  if (payload === null) {
    return undefined as T;
  }

  if (isApiEnvelope<T>(payload)) {
    return payload.data;
  }

  return payload as T;
}

export class ApiError extends Error {
  status: number;
  details: unknown;
  code?: string;

  constructor(status: number, details: unknown, message: string, code?: string) {
    super(message);
    this.status = status;
    this.details = details;
    this.code = code;
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body: unknown) => request<T>(path, "POST", body),
  put: <T>(path: string, body: unknown) => request<T>(path, "PUT", body),
  patch: <T>(path: string, body: unknown) => request<T>(path, "PATCH", body),
  del: <T>(path: string) => request<T>(path, "DELETE"),
};
