import { Octokit } from "@octokit/rest";

const token = process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error(
    "GITHUB_TOKEN environment variable is required to call the GitHub API."
  );
}

export const octokit = new Octokit({
  auth: token,
  userAgent: "pr-actions/1.0.0",
});

export interface PullRequestRef {
  owner: string;
  repo: string;
  pull_number: number;
}

/**
 * Resolves the GraphQL node_id for a pull request. Needed because some
 * mutations (convert to draft, mark ready for review) only exist in the
 * GraphQL API, not REST.
 */
export async function getPullRequestNodeId(
  ref: PullRequestRef
): Promise<string> {
  const { owner, repo, pull_number } = ref;
  const { data } = await octokit.pulls.get({ owner, repo, pull_number });
  return data.node_id;
}
