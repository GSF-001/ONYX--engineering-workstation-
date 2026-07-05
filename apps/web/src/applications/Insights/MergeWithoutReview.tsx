import type { RepositoryInsights } from "./InsightsTypes";
import { EmptyState, Badge } from "../../shared/components";

export function MergeWithoutReview({ data }: { data: RepositoryInsights["mergeWithoutReview"] }) {
  if (data.length === 0) {
    return <EmptyState title="Clean record" description="No PRs merged without at least one approval in the last 30 days." />;
  }

  return (
    <div style={{ padding: 12 }}>
      <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 8 }}>
        MERGED WITHOUT REVIEW — LAST 30 DAYS
      </p>
      {data.map((pr) => (
        <div key={pr.pullRequestId} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--win-face-dark)" }}>
          <span style={{ fontSize: 13 }}>#{pr.number} {pr.title}</span>
          <Badge tone="danger">{pr.authorLogin}</Badge>
        </div>
      ))}
    </div>
  );
}
