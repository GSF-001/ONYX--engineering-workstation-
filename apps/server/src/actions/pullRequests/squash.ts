import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface SquashMergePullRequestInput {
  owner: string;
  repo: string;
  pullNumber: number;
  commitTitle?: string;
  commitMessage?: string;
  sha?: string;
}

const ACTION = "pulls.squash";

/** Squash-merges all commits in the PR into a single commit. */
export async function squashMergePullRequest(actor: GithubActorContext, input: SquashMergePullRequestInput) {
  const target = `${input.owner}/${input.repo}#${input.pullNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.pulls.merge({
          owner: input.owner,
          repo: input.repo,
          pull_number: input.pullNumber,
          commit_title: input.commitTitle,
          commit_message: input.commitMessage,
          sha: input.sha,
          merge_method: "squash",
        }),
      "pulls.merge(squash)"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
