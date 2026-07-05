import type { WeekendHeatmapResult } from "./HeatmapTypes";
import { formatPercent } from "../../shared/utils";

/** The weekend-ratio callout specifically, separate from the full grid
 * (CommitHeatmap.tsx) — same data, different framing (a single stat vs.
 * the visual grid). */
export function WeekendHeatmap({ data }: { data: WeekendHeatmapResult }) {
  const isHigh = data.weekendCommitRatio > 0.2;

  return (
    <div style={{ padding: 16, textAlign: "center" }}>
      <p style={{ fontSize: 11, color: "var(--win-text-dim)" }}>WEEKEND COMMIT RATIO</p>
      <p
        style={{
          fontSize: 40,
          fontFamily: "var(--win-font-mono)",
          fontWeight: 700,
          color: isHigh ? "var(--win-warning)" : "var(--win-success)",
        }}
      >
        {formatPercent(data.weekendCommitRatio)}
      </p>
      <p style={{ fontSize: 12, color: "var(--win-text-dim)" }}>
        {isHigh ? "Meaningful weekend activity — worth checking in on the team." : "Weekend activity looks healthy."}
      </p>
    </div>
  );
}
