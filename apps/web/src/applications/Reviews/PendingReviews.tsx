// Reviews/PendingReviews.tsx
import { EmptyState } from "../../shared/components";

/**
 * A per-review-status breakdown (pending/approved/changes-requested counts)
 * would need a raw reviews-list endpoint, which the backend doesn't expose
 * — only aggregates (reviewer load, reciprocity gap) exist. Honest gap,
 * same pattern as Repository/Commits.tsx.
 */
export function PendingReviews() {
  return (
    <EmptyState
      title="Per-review status list isn't exposed yet"
      description="Needs a GET /repositories/:id/reviews endpoint on the backend — only aggregated reviewer-load data exists today."
    />
  );
}
