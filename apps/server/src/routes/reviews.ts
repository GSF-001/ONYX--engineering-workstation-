import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/middleware.js";
import { getRepositoryById } from "../db/queries.js";
import { userHasTeamRole } from "../auth/permissions.js";
import { computeReviewerLoad } from "../scoring/reviewerLoad.js";
import { computeReciprocityGap } from "../scoring/reciprocityGap.js";

export async function reviewRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { repositoryId: string } }>(
    "/repositories/:repositoryId/reviewer-load",
    { preHandler: requireAuth },
    async (request, reply) => {
      const repositoryId = Number(request.params.repositoryId);
      const repo = await getRepositoryById(repositoryId);
      if (!repo) {
        reply.code(404).send({ error: "Repository not found" });
        return;
      }
      if (repo.teamId) {
        const allowed = await userHasTeamRole(request.currentUser!.id, repo.teamId, "member");
        if (!allowed) {
          reply.code(403).send({ error: "Not a member of this team" });
          return;
        }
      }

      const load = await computeReviewerLoad(repositoryId);
      reply.send(load);
    }
  );

  app.get<{ Params: { repositoryId: string } }>(
    "/repositories/:repositoryId/reciprocity-gap",
    { preHandler: requireAuth },
    async (request, reply) => {
      const repositoryId = Number(request.params.repositoryId);
      const repo = await getRepositoryById(repositoryId);
      if (!repo) {
        reply.code(404).send({ error: "Repository not found" });
        return;
      }
      if (repo.teamId) {
        const allowed = await userHasTeamRole(request.currentUser!.id, repo.teamId, "member");
        if (!allowed) {
          reply.code(403).send({ error: "Not a member of this team" });
          return;
        }
      }

      const gap = await computeReciprocityGap(repositoryId);
      reply.send(gap);
    }
  );
}
