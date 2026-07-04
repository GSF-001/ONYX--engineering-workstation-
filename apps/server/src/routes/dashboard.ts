import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/middleware.js";
import { getTeamBySlug, listRepositoriesForTeam } from "../db/queries.js";
import { getDashboardSummary } from "../services/analytics.js";
import { userHasTeamRole } from "../auth/permissions.js";

export async function dashboardRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { teamSlug: string } }>(
    "/dashboard/:teamSlug",
    { preHandler: requireAuth },
    async (request, reply) => {
      const team = await getTeamBySlug(request.params.teamSlug);
      if (!team) {
        reply.code(404).send({ error: "Team not found" });
        return;
      }

      const allowed = await userHasTeamRole(request.currentUser!.id, team.id, "member");
      if (!allowed) {
        reply.code(403).send({ error: "Not a member of this team" });
        return;
      }

      const repos = await listRepositoriesForTeam(team.id);
      const summary = await getDashboardSummary(repos.map((r) => r.id));

      reply.send({
        team: { id: team.id, name: team.name, slug: team.slug },
        repositories: repos.map((r) => ({ id: r.id, fullName: r.fullName })),
        scores: summary,
      });
    }
  );
}
