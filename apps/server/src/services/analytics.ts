import {
  computeActivityScore,
  computeBusFactor,
  computeCommitDecay,
  computeIssueGraveyard,
  computeMergeWithoutReview,
  computeReciprocityGap,
  computeReviewHealth,
  computeReviewerLoad,
  computeStaleRadar,
  computeWeekendHeatmap,
} from "../scoring/index.js";
import { cache } from "./cache.js";

const TTL_MS = 5 * 60 * 1000;

export async function getRepositoryInsights(repositoryId: number) {
  return cache.wrap(`analytics:${repositoryId}:insights`, TTL_MS, async () => {
    const [
      activityScore,
      reviewHealth,
      reviewerLoad,
      mergeWithoutReview,
      staleRadar,
      reciprocityGap,
      issueGraveyard,
      commitDecay,
      weekendHeatmap,
      busFactor,
    ] = await Promise.all([
      computeActivityScore(repositoryId),
      computeReviewHealth(repositoryId),
      computeReviewerLoad(repositoryId),
      computeMergeWithoutReview(repositoryId),
      computeStaleRadar(repositoryId),
      computeReciprocityGap(repositoryId),
      computeIssueGraveyard(repositoryId),
      computeCommitDecay(repositoryId),
      computeWeekendHeatmap(repositoryId),
      computeBusFactor(repositoryId),
    ]);

    return {
      repositoryId,
      generatedAt: new Date().toISOString(),
      activityScore,
      reviewHealth,
      reviewerLoad,
      mergeWithoutReview,
      staleRadar,
      reciprocityGap,
      issueGraveyard,
      commitDecay,
      weekendHeatmap,
      busFactor,
    };
  });
}

export async function getDashboardSummary(repositoryIds: number[]) {
  const scores = await Promise.all(
    repositoryIds.map(async (id) => ({
      repositoryId: id,
      activityScore: await computeActivityScore(id),
    }))
  );
  return scores;
}
