import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { requireAuth, requireCsrf } from "../auth/middleware.js";
import { db } from "../db/client.js";
import { repositories } from "../db/schema.js";
import { getRepositoryById, getUserById } from "../db/queries.js";
import { userHasTeamRole } from "../auth/permissions.js";
import { syncRepository } from "../services/repository.js";
import { createGitHubClient } from "../services/github.js";

export async function repositoryRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { id: string } }>(
    "/repositories/:id",
    { preHandler: requireAuth },
    async (request, reply) => {
      const repo = await getRepositoryById(Number(request.params.id));
      if (!repo) {
        reply.code(404).send({ error: "Repository not found" });
        return;
      }
      reply.send(repo);
    }
  );

  app.post<{ Body: { teamId: number; owner: string; name: string } }>(
    "/repositories",
    { preHandler: [requireAuth, requireCsrf] },
    async (request, reply) => {
      const { teamId, owner, name } = request.body;

      const allowed = await userHasTeamRole(request.currentUser!.id, teamId, "admin");
      if (!allowed) {
        reply.code(403).send({ error: "Requires admin role on the team" });
        return;
      }

      const user = await getUserById(request.currentUser!.id);
      const client = createGitHubClient(user!.accessToken);
      const ghRepo = await client.getRepo(owner, name);

      const [repo] = await db
        .insert(repositories)
        .values({
          teamId,
          githubRepoId: ghRepo.id,
          owner,
          name,
          fullName: ghRepo.full_name,
          defaultBranch: ghRepo.default_branch,
          private: ghRepo.private,
        })
        .onConflictDoUpdate({
          target: repositories.githubRepoId,
          set: { teamId, defaultBranch: ghRepo.default_branch },
        })
        .returning();

      reply.code(201).send(repo);
    }
  );

  app.post<{ Params: { id: string } }>(
    "/repositories/:id/sync",
    { preHandler: [requireAuth, requireCsrf] },
    async (request, reply) => {
      const repo = await getRepositoryById(Number(request.params.id));
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

      const user = await getUserById(request.currentUser!.id);
      await syncRepository(repo.id, user!.accessToken);

      reply.send({ ok: true });
    }
  );

  app.delete<{ Params: { id: string } }>(
    "/repositories/:id",
    { preHandler: [requireAuth, requireCsrf] },
    async (request, reply) => {
      const repo = await getRepositoryById(Number(request.params.id));
      if (!repo) {
        reply.code(404).send({ error: "Repository not found" });
        return;
      }

      if (repo.teamId) {
        const allowed = await userHasTeamRole(request.currentUser!.id, repo.teamId, "admin");
        if (!allowed) {
          reply.code(403).send({ error: "Requires admin role on the team" });
          return;
        }
      }

      await db.delete(repositories).where(eq(repositories.id, repo.id));
      reply.code(204).send();
    }
  );
}
