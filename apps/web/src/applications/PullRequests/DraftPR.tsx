// PullRequests/DraftPR.tsx
import { EmptyState } from "../../shared/components";

/**
 * GitHub's API distinguishes draft PRs via a `draft` boolean the backend
 * doesn't currently store (pull_requests table has no `draft` column).
 * Rather than guess, this tab says so.
 */
export function DraftPR() {
  return (
    <EmptyState
      title="Draft PRs aren't tracked yet"
      description="The pull_requests table doesn't store the draft flag yet — needs a schema + sync update."
    />
  );
}
