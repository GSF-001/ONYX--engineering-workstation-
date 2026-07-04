import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "./client.js";
import {
  checkRuns,
  commits,
  issues,
  pullRequests,
  repositories,
  reviews,
  teamMembers,
  teams,
  users,
} from "./schema.js";

export async function getUserByGithubId(githubId: number) {
  const rows = await db.select().from(users).where(eq(users.githubId, githubId)).limit(1);
  return rows[0] ?? null;
}

export async function getUserById(id: number) {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getRepositoryByFullName(fullName: string) {
  const rows = await db
    .select()
    .from(repositories)
    .where(eq(repositories.fullName, fullName))
    .limit(1);
  return rows[0] ?? null;
}

export async function getRepositoryById(id: number) {
  const rows = await db.select().from(repositories).where(eq(repositories.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function listRepositoriesForTeam(teamId: number) {
  return db.select().from(repositories).where(eq(repositories.teamId, teamId));
}

export async function listPullRequestsForRepo(
  repositoryId: number,
  opts: { state?: "open" | "closed" | "merged"; since?: Date; limit?: number } = {}
) {
  const conditions = [eq(pullRequests.repositoryId, repositoryId)];
  if (opts.state) conditions.push(eq(pullRequests.state, opts.state));
  if (opts.since) conditions.push(gte(pullRequests.createdAt, opts.since));

  return db
    .select()
    .from(pullRequests)
    .where(and(...conditions))
    .orderBy(desc(pullRequests.createdAt))
    .limit(opts.limit ?? 200);
}

export async function listReviewsForPullRequest(pullRequestId: number) {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.pullRequestId, pullRequestId))
    .orderBy(reviews.submittedAt);
}

export async function listReviewsForRepoSince(repositoryId: number, since: Date) {
  return db
    .select({
      review: reviews,
      pullRequest: pullRequests,
    })
    .from(reviews)
    .innerJoin(pullRequests, eq(reviews.pullRequestId, pullRequests.id))
    .where(and(eq(pullRequests.repositoryId, repositoryId), gte(reviews.submittedAt, since)));
}

export async function listOpenIssuesForRepo(repositoryId: number) {
  return db
    .select()
    .from(issues)
    .where(and(eq(issues.repositoryId, repositoryId), eq(issues.state, "open")));
}

export async function listCommitsForRepoSince(repositoryId: number, since: Date) {
  return db
    .select()
    .from(commits)
    .where(and(eq(commits.repositoryId, repositoryId), gte(commits.committedAt, since)))
    .orderBy(desc(commits.committedAt));
}

export async function listCheckRunsForRepo(repositoryId: number, headSha: string) {
  return db
    .select()
    .from(checkRuns)
    .where(and(eq(checkRuns.repositoryId, repositoryId), eq(checkRuns.headSha, headSha)));
}

export async function getTeamBySlug(slug: string) {
  const rows = await db.select().from(teams).where(eq(teams.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getTeamMembership(teamId: number, userId: number) {
  const rows = await db
    .select()
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function countMergedWithoutApproval(repositoryId: number, since: Date) {
  const merged = await db
    .select({
      id: pullRequests.id,
      mergedAt: pullRequests.mergedAt,
    })
    .from(pullRequests)
    .where(
      and(
        eq(pullRequests.repositoryId, repositoryId),
        eq(pullRequests.state, "merged"),
        gte(pullRequests.mergedAt, since)
      )
    );
  return merged;
}
