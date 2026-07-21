import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/index.js";
import { getUserById } from "../db/queries.js";

export async function identityRoutes(app: FastifyInstance): Promise<void> {
  // Stub: returns current user's identity info.
  // TODO: replace with full ONYX identity system (anonymous handles, cooldown).
  app.get("/identity/me", { preHandler: requireAuth }, async (request, reply) => {
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
    });
  });
}
