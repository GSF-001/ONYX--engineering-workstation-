import type { ReviewerLoadEntry } from "../../shared/types";
import { EmptyState } from "../../shared/components";

interface TeamReviewOverviewProps {
  reviewerLoad: ReviewerLoadEntry[];
}

/** The mockup's "TEAM REVIEW OVERVIEW" table — reviewer, pending count,
 * completed-30d, derived overload flag. Real data, same source as
 * Team/Leaderboard.tsx and Reviews/ReviewerLoad.tsx. */
export function TeamReviewOverview({ reviewerLoad }: TeamReviewOverviewProps) {
  if (reviewerLoad.length === 0) {
    return <EmptyState title="No reviewer activity yet" />;
  }

  return (
    <div className="win-frame" style={{ padding: 10 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--win-text-dim)", marginBottom: 8 }}>
        TEAM REVIEW OVERVIEW
      </p>
      <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--win-text-dim)" }}>
            <th style={{ padding: 4 }}>Reviewer</th>
            <th style={{ padding: 4 }}>Pending</th>
            <th style={{ padding: 4 }}>Reviews (30d)</th>
          </tr>
        </thead>
        <tbody>
          {reviewerLoad.slice(0, 6).map((r) => (
            <tr key={r.reviewerLogin} style={{ borderTop: "1px solid var(--win-face-dark)" }}>
              <td style={{ padding: 4 }}>{r.reviewerLogin}</td>
              <td style={{ padding: 4, color: r.overloaded ? "var(--win-danger)" : "inherit" }}>
                {r.pendingReviewCount}
              </td>
              <td style={{ padding: 4 }}>{r.completedReviewCount30d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
