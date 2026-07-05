// PullRequests/WaitingReview.tsx
import type { PullRequest } from "./PullRequestTypes";
import { PullRequestList } from "./PullRequestListShared";

export function WaitingReview({ pullRequests, onOpen }: { pullRequests: PullRequest[]; onOpen: (pr: PullRequest) => void }) {
  const waiting = pullRequests.filter((pr) => pr.state === "open" && !pr.firstReviewAt);
  return <PullRequestList pullRequests={waiting} onOpen={onOpen} />;
}
