import type { WeekendHeatmapResult } from "../types";
import { formatPercent } from "../utils/formatNumber";

interface WeekendHeatmapWidgetProps {
  data: WeekendHeatmapResult;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function intensityColor(count: number, max: number): string {
  if (max === 0 || count === 0) return "var(--color-bg-inset)";
  const ratio = count / max;
  // Interpolate from dim accent to full accent brightness.
  const alpha = 0.15 + ratio * 0.75;
  return `rgba(79, 209, 174, ${alpha.toFixed(2)})`;
}

/**
 * 7x24 commit activity grid. Shared between the Insights overview (compact)
 * and the dedicated Heatmap page (full size) — same data shape, same color
 * scale, so the reading doesn't shift between contexts.
 */
export function WeekendHeatmapWidget({ data }: WeekendHeatmapWidgetProps) {
  const maxCount = Math.max(1, ...data.cells.map((c) => c.count));

  return (
    <div>
      <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
        <div style={{ width: 34 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: 2, flex: 1 }}>
          {Array.from({ length: 24 }, (_, hour) => (
            <span
              key={hour}
              style={{
                fontSize: 9,
                color: "var(--color-text-faint)",
                textAlign: "center",
                visibility: hour % 4 === 0 ? "visible" : "hidden",
              }}
            >
              {hour}
            </span>
          ))}
        </div>
      </div>

      {DAY_LABELS.map((label, day) => (
        <div key={label} style={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <span
            style={{
              width: 34,
              fontSize: 11,
              color: "var(--color-text-dim)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {label}
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: 2, flex: 1 }}>
            {Array.from({ length: 24 }, (_, hour) => {
              const cell = data.cells.find((c) => c.dayOfWeek === day && c.hour === hour);
              const count = cell?.count ?? 0;
              return (
                <div
                  key={hour}
                  title={`${label} ${hour}:00 — ${count} commit${count === 1 ? "" : "s"}`}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 2,
                    background: intensityColor(count, maxCount),
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}

      <p style={{ marginTop: 12, fontSize: 12, color: "var(--color-text-dim)" }}>
        {formatPercent(data.weekendCommitRatio)} of commits land on a weekend.
      </p>
    </div>
  );
}
