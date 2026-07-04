import { broadcastToRoom } from "./broadcast.js";
import type { ActivityScoreResult } from "../scoring/activityScore.js";

export function emitDashboardScoreUpdate(teamId: number, result: ActivityScoreResult): void {
  broadcastToRoom(`dashboard:${teamId}`, {
    type: "dashboard.score_updated",
    repositoryId: result.repositoryId,
    overallScore: result.overallScore,
    breakdown: result.breakdown,
  });
}
