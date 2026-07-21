import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/index.js";

export async function groupsRoutes(app: FastifyInstance): Promise<void> {
  // Stub: Groups module not yet implemented.
  // TODO: public/private/anonymous groups, membership, chat, files, activity.
  app.get("/groups", { preHandler: requireAuth }, async (_request, reply) => {
    reply.send({ groups: [] });
  });
} 
