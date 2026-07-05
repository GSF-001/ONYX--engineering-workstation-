// Issues/ClosedIssues.tsx
import { EmptyState } from "../../shared/components";

export function ClosedIssues() {
  return (
    <EmptyState
      title="Closed issues list isn't exposed yet"
      description="Needs GET /repositories/:id/issues?state=closed on the backend."
    />
  );
}
