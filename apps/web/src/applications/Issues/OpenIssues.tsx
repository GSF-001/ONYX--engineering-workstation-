import type { GraveyardIssue } from "./IssuesTypes";
import { EmptyState, Badge } from "../../shared/components";

/**
 * Real backend data is limited to the graveyard view (open issues past an
 * age threshold). A full open-issues list needs GET /repositories/:id/issues
 * — not built yet. This shows what's real: aged-out open issues.
 */
export function OpenIssues({ graveyard }: { graveyard: GraveyardIssue[] }) {
  if (graveyard.length === 0) {
    return (
      <EmptyState
        title="No aging open issues"
        description="Nothing has been open past the graveyard threshold — good sign, or the full open-issues list just isn't exposed yet (needs a backend endpoint)."
      />
    );
  }

  return (
    <div style={{ padding: 12 }}>
      {graveyard.map((issue) => (
        <div key={issue.number} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--win-face-dark)" }}>
          <span style={{ fontSize: 13 }}>#{issue.number} {issue.title}</span>
          <Badge tone={issue.ageDays > 180 ? "danger" : "warn"}>{issue.ageDays}d old</Badge>
        </div>
      ))}
    </div>
  );
}
