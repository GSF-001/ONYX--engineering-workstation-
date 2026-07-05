// Repository/Branches.tsx
import { EmptyState } from "../../shared/components";

/**
 * Honest limitation: the backend has no /branches endpoint (no branch
 * table, no GitHub branches sync). Rather than fabricate branch names,
 * this tab says exactly what's missing until that endpoint exists.
 */
export function Branches() {
  return (
    <EmptyState
      title="Branches aren't wired up yet"
      description="This needs a GET /repositories/:id/branches endpoint on the server — not built in this batch."
    />
  );
}
