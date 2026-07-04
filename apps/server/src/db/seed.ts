import { eq } from "drizzle-orm";
import { db } from "./client.js";
import { repositories, teams, teamMembers, users } from "./schema.js";
import { logger } from "../services/logger.js";

export async function seed(): Promise<void> {
  const existing = await db.select().from(teams).where(eq(teams.slug, "demo-team"));
  if (existing.length > 0) {
    logger.info("Seed data already present, skipping.");
    return;
  }

  const [team] = await db
    .insert(teams)
    .values({ name: "Demo Team", slug: "demo-team" })
    .returning();

  const [user] = await db
    .insert(users)
    .values({
      githubId: 1,
      login: "demo-user",
      name: "Demo User",
      email: "demo@example.com",
      accessToken: "demo-token",
    })
    .returning();

  await db.insert(teamMembers).values({ teamId: team.id, userId: user.id, role: "owner" });

  await db.insert(repositories).values({
    teamId: team.id,
    githubRepoId: 1,
    owner: "demo-org",
    name: "demo-repo",
    fullName: "demo-org/demo-repo",
    defaultBranch: "main",
  });

  logger.info("Seed data inserted.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error({ err }, "Seed failed");
      process.exit(1);
    });
}
