import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { pullRequests, reviews } from "../db/schema.js";

export interface ReciprocityPair {
  personA: string;
  personB: string;
  aReviewedB: number;
  bReviewedA: number;
  gap: number;
}

export async function computeReciprocityGap(repositoryId: number): Promise<ReciprocityPair[]> {
  const rows = await db
    .select({
      reviewerLogin: reviews.reviewerLogin,
      authorLogin: pullRequests.authorLogin,
    })
    .from(reviews)
    .innerJoin(pullRequests, eq(reviews.pullRequestId, pullRequests.id))
    .where(eq(pullRequests.repositoryId, repositoryId));

  const counts = new Map<string, Map<string, number>>();

  for (const row of rows) {
    if (row.reviewerLogin === row.authorLogin) continue;
    if (!counts.has(row.reviewerLogin)) counts.set(row.reviewerLogin, new Map());
    const inner = counts.get(row.reviewerLogin)!;
    inner.set(row.authorLogin, (inner.get(row.authorLogin) ?? 0) + 1);
  }

  const seenPairs = new Set<string>();
  const pairs: ReciprocityPair[] = [];

  for (const [reviewer, authors] of counts) {
    for (const [author] of authors) {
      const pairKey = [reviewer, author].sort().join("::");
      if (seenPairs.has(pairKey)) continue;
      seenPairs.add(pairKey);

      const aReviewedB = counts.get(reviewer)?.get(author) ?? 0;
      const bReviewedA = counts.get(author)?.get(reviewer) ?? 0;

      pairs.push({
        personA: reviewer,
        personB: author,
        aReviewedB,
        bReviewedA,
        gap: Math.abs(aReviewedB - bReviewedA),
      });
    }
  }

  return pairs.sort((a, b) => b.gap - a.gap);
}
