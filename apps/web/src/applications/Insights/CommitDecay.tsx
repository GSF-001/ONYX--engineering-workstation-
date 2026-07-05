import type { RepositoryInsights } from "./InsightsTypes";
import { Badge, EmptyState } from "../../shared/components";

const TREND_TONE: Record<string, "good" | "warn" | "danger"> = {
  increasing: "good",
  stable: "warn",
  decreasing: "danger",
};

export function CommitDecay({ data }: { data: RepositoryInsights["commitDecay"] }) {
  if (data.length === 0) {
    return <EmptyState title="Not enough commit history" description="Needs more commits to compute a trend." />;
  }

  return (
    <div style={{ padding: 12 }}>
      {data.map((entry) => (
        <div key={entry.authorLogin} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
          <span>{entry.authorLogin}</span>
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: "var(--win-text-dim)", fontSize: 12 }}>
              {entry.recentCount} recent / {entry.earlierCount} earlier
            </span>
            <Badge tone={TREND_TONE[entry.trend] ?? "neutral"}>{entry.trend}</Badge>
          </span>
        </div>
      ))}
    </div>
  );
}
