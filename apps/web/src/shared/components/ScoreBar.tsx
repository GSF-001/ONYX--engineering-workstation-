import { formatScore } from "../utils/formatNumber";

interface ScoreBarProps {
  label: string;
  score: number; // 0-100
  compact?: boolean;
}

function colorForScore(score: number): string {
  if (score >= 75) return "var(--color-good)";
  if (score >= 45) return "var(--color-warn)";
  return "var(--color-danger)";
}

/**
 * Horizontal 0-100 score bar used for every scoring metric (review health,
 * bus factor, etc). Color communicates severity so the eye doesn't have to
 * read the number to get the gist.
 */
export function ScoreBar({ label, score, compact = false }: ScoreBarProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const color = colorForScore(clamped);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: compact ? 12 : 13 }}>
        <span style={{ color: "var(--color-text-dim)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-display)", color, fontWeight: 600 }}>
          {formatScore(clamped)}
        </span>
      </div>
      <div
        style={{
          height: compact ? 4 : 6,
          borderRadius: 999,
          background: "var(--color-bg-inset)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${clamped}%`,
            background: color,
            borderRadius: 999,
            transition: "width 300ms ease",
          }}
        />
      </div>
    </div>
  );
}
