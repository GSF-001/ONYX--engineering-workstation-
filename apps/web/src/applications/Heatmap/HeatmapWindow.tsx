import { useState } from "react";
import type { useHeatmapData } from "./HeatmapHooks";
import { CommitHeatmap } from "./CommitHeatmap";
import { ReviewHeatmap } from "./ReviewHeatmap";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { WeekendHeatmap } from "./WeekendHeatmap";
import { EmptyState, LoadingSpinner } from "../../shared/components";

type Tab = "commits" | "reviews" | "activity" | "weekend";

const TABS: { id: Tab; label: string }[] = [
  { id: "commits", label: "Commits" },
  { id: "reviews", label: "Reviews" },
  { id: "activity", label: "Activity" },
  { id: "weekend", label: "Weekend" },
];

export function HeatmapWindow({ data }: { data: ReturnType<typeof useHeatmapData> }) {
  const [tab, setTab] = useState<Tab>("commits");

  if (data.loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <LoadingSpinner label="Loading heatmap..." />
      </div>
    );
  }
  if (data.error || !data.data) return <EmptyState title="Couldn't load heatmap" description={data.error ?? ""} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--win-face-dark)" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="win-button"
            style={{
              width: "auto",
              padding: "6px 10px",
              border: "none",
              borderBottom: tab === t.id ? "2px solid var(--win-accent)" : "2px solid transparent",
              background: "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {tab === "commits" && <CommitHeatmap data={data.data} />}
        {tab === "reviews" && <ReviewHeatmap />}
        {tab === "activity" && <ActivityHeatmap />}
        {tab === "weekend" && <WeekendHeatmap data={data.data} />}
      </div>
    </div>
  );
}
