import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { pullRequests, reviews } from "../db/schema.js";

export interface ReviewerLoadEntry {
  reviewerLogin: string;
  pendingReviewCount: number;
  completedReviewCount30d: number;
  overloaded: boolean;
}

export async function computeReviewerLoad(
  repositoryId: number,
  overloadThreshold = 5
): Promise<ReviewerLoadEntry[]> {
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const rows = await db
    .select({
      reviewerLogin: reviews.reviewerLogin,
      prState: pullRequests.state,
      submittedAt: reviews.submittedAt,
    })
    .from(reviews)
    .innerJoin(pullRequests, eq(reviews.pullRequestId, pullRequests.id))
    .where(eq(pullRequests.repositoryId, repositoryId));

  const byReviewer = new Map<string, ReviewerLoadEntry>();

  for (const row of rows) {
    const entry = byReviewer.get(row.reviewerLogin) ?? {
      reviewerLogin: row.reviewerLogin,
      pendingReviewCount: 0,
      completedReviewCount30d: 0,
      overloaded: false,
    };

    if (row.prState === "open") entry.pendingReviewCount += 1;
    if (row.submittedAt >= since30d) entry.completedReviewCount30d += 1;

    byReviewer.set(row.reviewerLogin, entry);
  }

  const result = Array.from(byReviewer.values());
  for (const entry of result) {
    entry.overloaded = entry.pendingReviewCount > overloadThreshold;
  }

  return result.sort((a, b) => b.pendingReviewCount - a.pendingReviewCount);
}
