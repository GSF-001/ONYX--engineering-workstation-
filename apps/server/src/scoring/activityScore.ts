import { computeReviewHealth } from "./reviewHealth.js";
import { computeBusFactor } from "./busFactor.js";
import { computeStaleRadar } from "./staleRadar.js";
import { computeMergeWithoutReview } from "./mergeWithoutReview.js";
import { computeWeekendHeatmap } from "./weekendHeatmap.js";

export interface ActivityScoreResult {
  repositoryId: number;
  overallScore: number;
  breakdown: {
    reviewHealth: number;
    busFactorScore: number;
    staleness: number;
    governance: number;
    sustainability: number;
  };
}

export async function computeActivityScore(repositoryId: number): Promise<ActivityScoreResult> {
  const [health, busFactor, stale, mergeWithoutReview, heatmap] = await Promise.all([
    computeReviewHealth(repositoryId),
    computeBusFactor(repositoryId),
    computeStaleRadar(repositoryId),
    computeMergeWithoutReview(repositoryId),
    computeWeekendHeatmap(repositoryId),
  ]);

  const busFactorScore = Math.min(100, busFactor.busFactor * 20);
  const stalenessScore = Math.max(0, 100 - Math.min(stale.length, 20) * 5);
  const governanceScore = Math.max(0, 100 - mergeWithoutReview.length * 10);
  const sustainabilityScore = Math.max(0, 100 - heatmap.weekendCommitRatio * 200);

  const overallScore = Math.round(
    health.score * 0.3 +
      busFactorScore * 0.2 +
      stalenessScore * 0.2 +
      governanceScore * 0.15 +
      sustainabilityScore * 0.15
  );

  return {
    repositoryId,
    overallScore,
    breakdown: {
      reviewHealth: health.score,
      busFactorScore,
      staleness: stalenessScore,
      governance: governanceScore,
      sustainability: sustainabilityScore,
    },
  };
}
