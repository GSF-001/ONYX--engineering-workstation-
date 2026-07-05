import { handleApiResponse } from "./errorHandler";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const CSRF_COOKIE_NAME = "csrf_token";

function readCookie(name: string): string | undefined {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : undefined;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Single fetch wrapper every API call in the app goes through: attaches
 * credentials (session cookie), the CSRF header for unsafe methods, and a
 * consistent base URL. No component should construct its own fetch/axios
 * instance.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? "GET";
  const headers: Record<string, string> = {};

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (method !== "GET") {
    const csrfToken = readCookie(CSRF_COOKIE_NAME);
    if (csrfToken) headers["x-csrf-token"] = csrfToken;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  return handleApiResponse<T>(res);
}

export const apiClient = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: "GET", signal }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: "POST", body, signal }),
  patch: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: "PATCH", body, signal }),
  delete: <T>(path: string, signal?: AbortSignal) =>
    request<T>(path, { method: "DELETE", signal }),
};

export { API_BASE_URL };
