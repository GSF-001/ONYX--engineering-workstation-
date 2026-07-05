// PullRequests/MergedPR.tsx
import type { PullRequest } from "./PullRequestTypes";
import { PullRequestList } from "./PullRequestListShared";

export function MergedPR({ pullRequests, onOpen }: { pullRequests: PullRequest[]; onOpen: (pr: PullRequest) => void }) {
  return <PullRequestList pullRequests={pullRequests.filter((pr) => pr.state === "merged")} onOpen={onOpen} />;
}
