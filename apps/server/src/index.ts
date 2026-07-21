import "dotenv/config";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { runMigrations, closeDbConnection } from "./db/migrations.js";
import { authPlugin } from "./auth/index.js";
import { identityRoutes } from "./routes/identity.js";
import { profileRoutes } from "./routes/profile.js";
import { webhookPlugin } from "./webhook/index.js";
import { websocketRoutePlugin } from "./websocket/index.js";
import { apiRoutes } from "./routes/index.js";
import { logger } from "./services/logger.js";

const PORT = Number(process.env.PORT ?? 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";

async function main(): Promise<void> {
  await runMigrations();

  const app = Fastify({ logger: false });

  await app.register(cors, { origin: CORS_ORIGIN, credentials: true });
  await app.register(cookie);
  await app.register(webhookPlugin);
  await app.register(websocketRoutePlugin);

  // Root-level, unprefixed — pairs with /auth/* since identity/profile are
  // single-user account concerns, same tier as auth, not resource CRUD.
  await app.register(authPlugin);
  await app.register(identityRoutes);
  await app.register(profileRoutes);

  // Everything resource-oriented (repositories, community, groups, teams,
  // dashboard...) lives under /api.
  await app.register(apiRoutes, { prefix: "/api" });

  app.get("/health", async () => ({ ok: true }));

  app.setErrorHandler((err, request, reply) => {
    logger.error({ err, url: request.url }, "Unhandled request error");
    reply.code(500).send({ error: "Internal server error" });
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutting down gracefully");
    await app.close();
    await closeDbConnection();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  await app.listen({ port: PORT, host: "0.0.0.0" });
  logger.info({ port: PORT }, "Server listening");
}

main().catch((err) => {
  logger.error({ err }, "Fatal error during startup");
  process.exit(1);
});
