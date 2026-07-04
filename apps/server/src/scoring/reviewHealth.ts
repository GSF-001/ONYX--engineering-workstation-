import { listPullRequestsForRepo, listReviewsForRepoSince } from "../db/queries.js";

export interface ReviewHealthResult {
  repositoryId: number;
  medianTimeToFirstReviewHours: number | null;
  approvalRatio: number;
  totalReviewed: number;
  score: number;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export async function computeReviewHealth(
  repositoryId: number,
  windowDays = 30
): Promise<ReviewHealthResult> {
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
  const prs = await listPullRequestsForRepo(repositoryId, { since });
  const reviewRows = await listReviewsForRepoSince(repositoryId, since);

  const responseTimesHours: number[] = [];
  for (const pr of prs) {
    if (pr.firstReviewAt) {
      const hours = (pr.firstReviewAt.getTime() - pr.createdAt.getTime()) / (1000 * 60 * 60);
      responseTimesHours.push(hours);
    }
  }

  const approvedCount = reviewRows.filter((r) => r.review.state === "approved").length;
  const approvalRatio = reviewRows.length > 0 ? approvedCount / reviewRows.length : 1;

  const medianHours = median(responseTimesHours);

  const speedScore =
    medianHours === null ? 50 : Math.max(0, Math.min(100, 100 - ((medianHours - 24) / 72) * 100));
  const approvalScore = approvalRatio * 100;
  const score = Math.round(speedScore * 0.6 + approvalScore * 0.4);

  return {
    repositoryId,
    medianTimeToFirstReviewHours: medianHours,
    approvalRatio,
    totalReviewed: reviewRows.length,
    score,
  };
}
