import type { FastifyInstance } from "fastify";
import { dashboardRoutes } from "./dashboard.js";
import { repositoryRoutes } from "./repository.js";
import { pullRequestRoutes } from "./pullRequests.js";
import { reviewRoutes } from "./reviews.js";
import { insightsRoutes } from "./insights.js";
import { reportRoutes } from "./reports.js";
import { teamRoutes } from "./team.js";
import { activityRoutes } from "./activity.js";
import { settingsRoutes } from "./settings.js";

export async function apiRoutes(app: FastifyInstance): Promise<void> {
  await app.register(dashboardRoutes);
  await app.register(repositoryRoutes);
  await app.register(pullRequestRoutes);
  await app.register(reviewRoutes);
  await app.register(insightsRoutes);
  await app.register(reportRoutes);
  await app.register(teamRoutes);
  await app.register(activityRoutes);
  await app.register(settingsRoutes);
}
