import { and, eq, lt } from "drizzle-orm";
import { db } from "../db/client.js";
import { issues, pullRequests } from "../db/schema.js";

export interface StaleItem {
  type: "pull_request" | "issue";
  id: number;
  number: number;
  title: string;
  authorLogin: string;
  updatedAt: Date;
  daysSinceUpdate: number;
}

export async function computeStaleRadar(
  repositoryId: number,
  staleDays = 14
): Promise<StaleItem[]> {
  const cutoff = new Date(Date.now() - staleDays * 24 * 60 * 60 * 1000);

  const stalePrs = await db
    .select()
    .from(pullRequests)
    .where(
      and(
        eq(pullRequests.repositoryId, repositoryId),
        eq(pullRequests.state, "open"),
        lt(pullRequests.updatedAt, cutoff)
      )
    );

  const staleIssues = await db
    .select()
    .from(issues)
    .where(
      and(
        eq(issues.repositoryId, repositoryId),
        eq(issues.state, "open"),
        lt(issues.updatedAt, cutoff)
      )
    );

  const now = Date.now();

  const prItems: StaleItem[] = stalePrs.map((pr) => ({
    type: "pull_request",
    id: pr.id,
    number: pr.number,
    title: pr.title,
    authorLogin: pr.authorLogin,
    updatedAt: pr.updatedAt,
    daysSinceUpdate: Math.floor((now - pr.updatedAt.getTime()) / (24 * 60 * 60 * 1000)),
  }));

  const issueItems: StaleItem[] = staleIssues.map((issue) => ({
    type: "issue",
    id: issue.id,
    number: issue.number,
    title: issue.title,
    authorLogin: issue.authorLogin,
    updatedAt: issue.updatedAt,
    daysSinceUpdate: Math.floor((now - issue.updatedAt.getTime()) / (24 * 60 * 60 * 1000)),
  }));

  return [...prItems, ...issueItems].sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate);
}
