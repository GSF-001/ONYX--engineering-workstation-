import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyJwt } from "./jwt.js";
import { getSessionTokenFromRequest } from "./cookies.js";
import { getSession } from "./session.js";
import { getUserById } from "../db/queries.js";
import { verifyCsrfToken } from "./csrf.js";
import { userHasTeamRole, type Role } from "./permissions.js";

declare module "fastify" {
  interface FastifyRequest {
    currentUser?: { id: number; login: string; name: string | null };
  }
}

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const token = getSessionTokenFromRequest(request);
  if (!token) {
    reply.code(401).send({ error: "Not authenticated" });
    return reply;
  }

  const payload = verifyJwt(token);
  if (!payload) {
    reply.code(401).send({ error: "Invalid or expired session" });
    return reply;
  }

  const session = await getSession(payload.sessionId);
  if (!session) {
    reply.code(401).send({ error: "Session expired" });
    return reply;
  }

  const user = await getUserById(payload.userId);
  if (!user) {
    reply.code(401).send({ error: "User not found" });
    return reply;
  }

  request.currentUser = { id: user.id, login: user.login, name: user.name };
}

export async function requireCsrf(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (!UNSAFE_METHODS.has(request.method)) return;

  if (!verifyCsrfToken(request)) {
    reply.code(403).send({ error: "Invalid CSRF token" });
    return reply;
  }
}

export function requireTeamRole(minimumRole: Role) {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.currentUser) {
      reply.code(401).send({ error: "Not authenticated" });
      return reply;
    }

    const params = request.params as { teamId?: string };
    const teamId = Number(params.teamId);
    if (!teamId || Number.isNaN(teamId)) {
      reply.code(400).send({ error: "Missing or invalid teamId" });
      return reply;
    }

    const allowed = await userHasTeamRole(request.currentUser.id, teamId, minimumRole);
    if (!allowed) {
      reply.code(403).send({ error: "Insufficient permissions" });
      return reply;
    }
  };
}
