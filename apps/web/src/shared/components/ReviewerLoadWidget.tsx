import type { ReviewerLoadEntry } from "../types";
import { Badge } from "./Badge";
import { EmptyState } from "./EmptyState";

interface ReviewerLoadWidgetProps {
  entries: ReviewerLoadEntry[];
}

/**
 * Ranked list of reviewers by pending-review count. Shared between the
 * Reviews page (full detail) and the Team page (summary panel) so the
 * "who's overloaded right now" signal reads the same in both places.
 */
export function ReviewerLoadWidget({ entries }: ReviewerLoadWidgetProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="No reviewer activity yet"
        description="Once pull requests get reviewed, load per reviewer shows up here."
      />
    );
  }

  const maxPending = Math.max(1, ...entries.map((e) => e.pendingReviewCount));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {entries.map((entry) => (
        <div key={entry.reviewerLogin} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 120, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
            {entry.reviewerLogin}
          </span>
          <div
            style={{
              flex: 1,
              height: 6,
              borderRadius: 999,
              background: "var(--color-bg-inset)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(entry.pendingReviewCount / maxPending) * 100}%`,
                background: entry.overloaded ? "var(--color-danger)" : "var(--color-accent)",
                borderRadius: 999,
              }}
            />
          </div>
          <span
            style={{
              width: 24,
              textAlign: "right",
              fontFamily: "var(--font-display)",
              fontSize: 12,
              color: "var(--color-text-dim)",
            }}
          >
            {entry.pendingReviewCount}
          </span>
          {entry.overloaded && <Badge tone="danger">overloaded</Badge>}
        </div>
      ))}
    </div>
  );
}
