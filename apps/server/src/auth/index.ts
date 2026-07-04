import type { FastifyInstance } from "fastify";
import { randomBytes } from "node:crypto";
import { buildGithubAuthorizeUrl, completeGithubOAuth } from "./githubOAuth.js";
import { createSession, destroySession, getSession } from "./session.js";
import { signJwt, verifyJwt } from "./jwt.js";
import {
  clearSessionCookie,
  getSessionTokenFromRequest,
  setCsrfCookie,
  setSessionCookie,
} from "./cookies.js";
import { generateCsrfToken } from "./csrf.js";
import { getUserById } from "../db/queries.js";
import { requireAuth } from "./middleware.js";

const oauthStateStore = new Map<string, number>();

function pruneExpiredStates() {
  const cutoff = Date.now() - 10 * 60 * 1000;
  for (const [state, createdAt] of oauthStateStore) {
    if (createdAt < cutoff) oauthStateStore.delete(state);
  }
}

export async function authPlugin(app: FastifyInstance): Promise<void> {
  app.get("/auth/github", async (_request, reply) => {
    pruneExpiredStates();
    const state = randomBytes(16).toString("hex");
    oauthStateStore.set(state, Date.now());
    reply.redirect(buildGithubAuthorizeUrl(state));
  });

  app.get<{ Querystring: { code?: string; state?: string } }>(
    "/auth/github/callback",
    async (request, reply) => {
      const { code, state } = request.query;

      if (!code || !state || !oauthStateStore.has(state)) {
        reply.code(400).send({ error: "Invalid OAuth state or missing code" });
        return;
      }
      oauthStateStore.delete(state);

      const user = await completeGithubOAuth(code);
      const { session, ttlSeconds } = await createSession({
        userId: user.id,
        userAgent: request.headers["user-agent"],
        ip: request.ip,
      });

      const token = signJwt({ userId: user.id, sessionId: session.id });
      setSessionCookie(reply, token, ttlSeconds);
      setCsrfCookie(reply, generateCsrfToken());

      const frontendUrl = process.env.CORS_ORIGIN ?? "/";
      reply.redirect(`${frontendUrl}/desktop`);
    }
  );

  app.post("/auth/logout", { preHandler: requireAuth }, async (request, reply) => {
    const token = getSessionTokenFromRequest(request);
    if (token) {
      const payload = verifyJwt(token);
      if (payload) await destroySession(payload.sessionId);
    }
    clearSessionCookie(reply);
    reply.send({ ok: true });
  });

  app.get("/auth/me", { preHandler: requireAuth }, async (request, reply) => {
    const user = await getUserById(request.currentUser!.id);
    if (!user) {
      reply.code(404).send({ error: "User not found" });
      return;
    }
    reply.send({
      id: user.id,
      login: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      email: user.email,
    });
  });
}

export { requireAuth, requireCsrf, requireTeamRole } from "./middleware.js";
export { userHasTeamRole, roleAtLeast, type Role } from "./permissions.js";
export { getSession } from "./session.js";
