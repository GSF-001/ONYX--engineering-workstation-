import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface RebaseMergePullRequestInput {
  owner: string;
  repo: string;
  pullNumber: number;
  sha?: string;
}

const ACTION = "pulls.rebase";

/** Rebase-merges the PR's commits onto the base branch without a merge commit. */
export async function rebaseMergePullRequest(actor: GithubActorContext, input: RebaseMergePullRequestInput) {
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
          sha: input.sha,
          merge_method: "rebase",
        }),
      "pulls.merge(rebase)"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
