import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/middleware.js";
import { getRepositoryById } from "../db/queries.js";
import { listPullRequestsForRepo } from "../db/queries.js";
import { computeReviewTimeline } from "../scoring/reviewTimeline.js";
import { userHasTeamRole } from "../auth/permissions.js";

async function assertRepoAccess(userId: number, repositoryId: number) {
  const repo = await getRepositoryById(repositoryId);
  if (!repo) return null;
  if (repo.teamId) {
    const allowed = await userHasTeamRole(userId, repo.teamId, "member");
    if (!allowed) return null;
  }
  return repo;
}

export async function pullRequestRoutes(app: FastifyInstance): Promise<void> {
  app.get<{
    Params: { repositoryId: string };
    Querystring: { state?: "open" | "closed" | "merged" };
  }>("/repositories/:repositoryId/pull-requests", { preHandler: requireAuth }, async (request, reply) => {
    const repositoryId = Number(request.params.repositoryId);
    const repo = await assertRepoAccess(request.currentUser!.id, repositoryId);
    if (!repo) {
      reply.code(404).send({ error: "Repository not found or access denied" });
      return;
    }

    const prs = await listPullRequestsForRepo(repositoryId, { state: request.query.state });
    reply.send(prs);
  });

  app.get<{ Params: { repositoryId: string; pullRequestId: string } }>(
    "/repositories/:repositoryId/pull-requests/:pullRequestId/timeline",
    { preHandler: requireAuth },
    async (request, reply) => {
      const repositoryId = Number(request.params.repositoryId);
      const repo = await assertRepoAccess(request.currentUser!.id, repositoryId);
      if (!repo) {
        reply.code(404).send({ error: "Repository not found or access denied" });
        return;
      }

      const timeline = await computeReviewTimeline(Number(request.params.pullRequestId));
      reply.send(timeline);
    }
  );
}
