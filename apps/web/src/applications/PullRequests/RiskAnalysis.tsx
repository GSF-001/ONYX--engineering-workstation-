import type { PullRequest } from "./PullRequestTypes";
import { Badge } from "../../shared/components";

interface RiskAnalysisProps {
  pullRequest: PullRequest;
}

/**
 * Lightweight, client-side risk heuristic based on fields already on the
 * PR object — not a server-computed score (that's what Insights is for),
 * just a quick "should I look closer" signal in the PR list.
 */
function assessRisk(pr: PullRequest): { level: "low" | "medium" | "high"; reason: string } {
  const totalChanges = pr.additions + pr.deletions;
  const ageHours = (Date.now() - new Date(pr.createdAt).getTime()) / (1000 * 60 * 60);

  if (pr.state === "open" && !pr.firstReviewAt && ageHours > 48) {
    return { level: "high", reason: "Open 48h+ with no review" };
  }
  if (totalChanges > 800) {
    return { level: "high", reason: "Large changeset" };
  }
  if (pr.state === "open" && !pr.firstReviewAt && ageHours > 24) {
    return { level: "medium", reason: "Waiting on first review" };
  }
  if (totalChanges > 300) {
    return { level: "medium", reason: "Medium-sized changeset" };
  }
  return { level: "low", reason: "Nothing unusual" };
}

export function RiskAnalysis({ pullRequest }: RiskAnalysisProps) {
  const risk = assessRisk(pullRequest);
  const tone = risk.level === "high" ? "danger" : risk.level === "medium" ? "warn" : "good";

  return <Badge tone={tone}>{risk.reason}</Badge>;
}
