import { getPullRequestTimeline, getPullRequests } from "../../shared/api";
import type { PullRequestState } from "../../shared/types";

export const PullRequestAPI = {
  list: (repositoryId: number, state?: PullRequestState) => getPullRequests(repositoryId, state),
  timeline: (repositoryId: number, pullRequestId: number) =>
    getPullRequestTimeline(repositoryId, pullRequestId),
};
