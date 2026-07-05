export type PullRequestState = "open" | "closed" | "merged";

export interface PullRequest {
  id: number;
  repositoryId: number;
  number: number;
  title: string;
  authorLogin: string;
  state: PullRequestState;
  additions: number;
  deletions: number;
  changedFiles: number;
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  closedAt: string | null;
  firstReviewAt: string | null;
}

export interface TimelineEvent {
  type: "opened" | "reviewed" | "merged" | "closed";
  actor: string;
  at: string;
  detail?: string;
}
