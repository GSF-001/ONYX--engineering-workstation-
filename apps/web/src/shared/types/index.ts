export * from "./User";
export * from "./Repository";
export * from "./PullRequest";
export * from "./Review";
export * from "./Issue";
export * from "./TeamMember";

export interface WeekendHeatmapCell {
  dayOfWeek: number;
  hour: number;
  count: number;
}

export interface WeekendHeatmapResult {
  cells: WeekendHeatmapCell[];
  weekendCommitRatio: number;
}

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
