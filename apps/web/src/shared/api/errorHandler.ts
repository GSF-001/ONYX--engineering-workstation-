export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Turns a non-2xx fetch Response into a thrown ApiError with the server's
 * error message (if any) attached, so callers can branch on `.status`.
 */
export async function handleApiResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = undefined;
  }

  const message =
    body && typeof body === "object" && "error" in body
      ? String((body as { error: unknown }).error)
      : `Request failed with status ${res.status}`;

  throw new ApiError(res.status, message, body);
}

export function isUnauthorized(err: unknown): boolean {
  return err instanceof ApiError && err.status === 401;
}

export function isForbidden(err: unknown): boolean {
  return err instanceof ApiError && err.status === 403;
}
