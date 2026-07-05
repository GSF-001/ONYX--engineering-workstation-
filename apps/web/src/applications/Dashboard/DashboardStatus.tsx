import type { ActivityScoreResult } from "./DashboardTypes";
import { ScoreBar } from "../../shared/components";

interface DashboardStatusProps {
  score: ActivityScoreResult | undefined;
}

export function DashboardStatus({ score }: DashboardStatusProps) {
  if (!score) return null;

  return (
    <div className="win-frame" style={{ padding: 12 }}>
      <p style={{ fontSize: 11, color: "var(--win-text-dim)" }}>HEALTH SCORE</p>
      <p
        style={{
          fontSize: 32,
          fontFamily: "var(--win-font-mono)",
          fontWeight: 700,
          color:
            score.overallScore >= 75
              ? "var(--win-success)"
              : score.overallScore >= 45
                ? "var(--win-warning)"
                : "var(--win-danger)",
        }}
      >
        {score.overallScore}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
        <ScoreBar label="Review health" score={score.breakdown.reviewHealth} compact />
        <ScoreBar label="Bus factor" score={score.breakdown.busFactorScore} compact />
        <ScoreBar label="Staleness" score={score.breakdown.staleness} compact />
        <ScoreBar label="Governance" score={score.breakdown.governance} compact />
        <ScoreBar label="Sustainability" score={score.breakdown.sustainability} compact />
      </div>
    </div>
  );
}
