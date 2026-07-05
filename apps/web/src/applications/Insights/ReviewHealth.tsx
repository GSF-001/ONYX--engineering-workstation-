import type { RepositoryInsights } from "./InsightsTypes";
import { ScoreBar } from "../../shared/components";
import { formatPercent } from "../../shared/utils";

export function ReviewHealth({ data }: { data: RepositoryInsights["reviewHealth"] }) {
  return (
    <div style={{ padding: 12 }}>
      <ScoreBar label="Review health" score={data.score} />
      <div style={{ marginTop: 12, fontSize: 12, color: "var(--win-text-dim)", display: "flex", flexDirection: "column", gap: 4 }}>
        <span>
          Median time to first review:{" "}
          {data.medianTimeToFirstReviewHours !== null
            ? `${data.medianTimeToFirstReviewHours.toFixed(1)}h`
            : "no data yet"}
        </span>
        <span>Approval ratio: {formatPercent(data.approvalRatio)}</span>
        <span>Reviews in window: {data.totalReviewed}</span>
      </div>
    </div>
  );
}
