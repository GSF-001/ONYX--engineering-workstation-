import { octokit, PullRequestRef } from "./client";

/**
 * Approves a pull request by submitting an APPROVE review.
 * Calls: POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews
 */
export async function approve(ref: PullRequestRef, body?: string) {
  const { owner, repo, pull_number } = ref;

  const response = await octokit.pulls.createReview({
    owner,
    repo,
    pull_number,
    event: "APPROVE",
    body,
  });

  return response.data;
}
