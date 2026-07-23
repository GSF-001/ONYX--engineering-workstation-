import { db } from "../db/client";
import { logger } from "../services/logger";

/**
 * refresh.ts
 * Refreshes expiring GitHub OAuth access tokens using stored refresh
 * tokens, persists the new token pair to Postgres, and exposes a
 * scheduler entry point for proactively refreshing tokens near expiry.
 *
 * Expects a `oauth_sessions` table:
 *   id                uuid primary key
 *   user_id           uuid not null
 *   access_token      text not null
 *   refresh_token     text
 *   token_expires_at  timestamptz
 *   refresh_expires_at timestamptz
 *   scopes            text[]
 *   updated_at        timestamptz not null default now()
 */

const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const REFRESH_MARGIN_SECONDS = 300; // refresh 5 minutes before actual expiry

const CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? "";

if (!CLIENT_ID || !CLIENT_SECRET) {
  logger.error("refresh.ts: GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET not configured");
}

export class TokenRefreshError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "TokenRefreshError";
  }
}

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_token_expires_in?: number;
  error?: string;
  error_description?: string;
}

export interface RefreshedTokenBundle {
  accessToken: string;
  refreshToken: string | null;
  scopes: string[];
  expiresAt: Date | null;
  refreshExpiresAt: Date | null;
}

interface OAuthSessionRow {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string | null;
  refresh_expires_at: string | null;
}

/**
 * Calls GitHub's token endpoint with grant_type=refresh_token to exchange
 * a still-valid refresh token for a new access token, then writes the
 * result back to oauth_sessions for the given session id.
 */
export async function refreshAccessToken(sessionId: string): Promise<RefreshedTokenBundle> {
  const { rows } = await db.query<OAuthSessionRow>(
    `select id, user_id, access_token, refresh_token, token_expires_at, refresh_expires_at
     from oauth_sessions where id = $1 limit 1`,
    [sessionId],
  );
  const session = rows[0];

  if (!session) {
    throw new TokenRefreshError(`No oauth_sessions row found for id ${sessionId}`, "session_not_found");
  }
  if (!session.refresh_token) {
    throw new TokenRefreshError("Session has no refresh_token on file", "no_refresh_token");
  }
  if (session.refresh_expires_at && new Date(session.refresh_expires_at) <= new Date()) {
    throw new TokenRefreshError("Refresh token has expired; user must re-authenticate", "refresh_token_expired");
  }

  const res = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: session.refresh_token,
    }).toString(),
  });

  if (!res.ok) {
    logger.error("refresh.refreshAccessToken: HTTP error from GitHub", { status: res.status });
    throw new TokenRefreshError(`GitHub token endpoint returned ${res.status}`, "github_http_error");
  }

  const data = (await res.json()) as GitHubTokenResponse;

  if (data.error) {
    logger.error("refresh.refreshAccessToken: GitHub returned an error", {
      error: data.error,
      description: data.error_description,
    });
    throw new TokenRefreshError(data.error_description ?? data.error, data.error);
  }

  const now = Date.now();
  const expiresAt = data.expires_in ? new Date(now + data.expires_in * 1000) : null;
  const refreshExpiresAt = data.refresh_token_expires_in
    ? new Date(now + data.refresh_token_expires_in * 1000)
    : null;
  const scopes = data.scope ? data.scope.split(",").map((s) => s.trim()).filter(Boolean) : [];

  await db.query(
    `update oauth_sessions
     set access_token = $1,
         refresh_token = $2,
         token_expires_at = $3,
         refresh_expires_at = $4,
         scopes = $5,
         updated_at = now()
     where id = $6`,
    [
      data.access_token,
      data.refresh_token ?? session.refresh_token,
      expiresAt,
      refreshExpiresAt,
      scopes,
      sessionId,
    ],
  );

  logger.info("refresh.refreshAccessToken: token refreshed", {
    sessionId,
    userId: session.user_id,
    expiresAt,
  });

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? session.refresh_token,
    scopes,
    expiresAt,
    refreshExpiresAt,
  };
}

/** True if the session's access token is expired or will expire within REFRESH_MARGIN_SECONDS. */
export function isTokenNearExpiry(tokenExpiresAt: string | Date | null): boolean {
  if (!tokenExpiresAt) return false; // no expiry set (classic OAuth apps) — never force refresh
  const expiry = new Date(tokenExpiresAt).getTime();
  return expiry - Date.now() <= REFRESH_MARGIN_SECONDS * 1000;
}

/**
 * Ensures a valid, non-expiring-soon access token for the given session,
 * refreshing it first if needed. Intended to be called at the top of any
 * request path that's about to hit the GitHub API on the user's behalf.
 */
export async function ensureFreshAccessToken(sessionId: string): Promise<string> {
  const { rows } = await db.query<OAuthSessionRow>(
    `select access_token, token_expires_at, refresh_token from oauth_sessions where id = $1 limit 1`,
    [sessionId],
  );
  const session = rows[0];
  if (!session) {
    throw new TokenRefreshError(`No oauth_sessions row found for id ${sessionId}`, "session_not_found");
  }

  if (!isTokenNearExpiry(session.token_expires_at)) {
    return session.access_token;
  }

  if (!session.refresh_token) {
    // Classic OAuth app tokens don't expire and have no refresh token — return as-is.
    return session.access_token;
  }

  const refreshed = await refreshAccessToken(sessionId);
  return refreshed.accessToken;
}

/**
 * Scans oauth_sessions for tokens expiring soon and refreshes them.
 * Intended to be invoked from automation/scheduler.ts on a periodic tick
 * (e.g. every minute) so users never hit a hard token expiry mid-session.
 */
export async function refreshExpiringSessions(): Promise<{ refreshed: number; failed: number }> {
  const cutoff = new Date(Date.now() + REFRESH_MARGIN_SECONDS * 1000);

  const { rows } = await db.query<{ id: string }>(
    `select id from oauth_sessions
     where refresh_token is not null
       and token_expires_at is not null
       and token_expires_at <= $1
       and (refresh_expires_at is null or refresh_expires_at > now())`,
    [cutoff],
  );

  let refreshed = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      await refreshAccessToken(row.id);
      refreshed += 1;
    } catch (err) {
      failed += 1;
      logger.error("refresh.refreshExpiringSessions: failed to refresh session", {
        sessionId: row.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  logger.info("refresh.refreshExpiringSessions: sweep complete", { refreshed, failed, scanned: rows.length });
  return { refreshed, failed };
}
