import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface ReopenPullRequestInput {
  owner: string;
  repo: string;
  pullNumber: number;
}

const ACTION = "pulls.reopen";

export async function reopenPullRequest(actor: GithubActorContext, input: ReopenPullRequestInput) {
  const target = `${input.owner}/${input.repo}#${input.pullNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.pulls.update({
          owner: input.owner,
          repo: input.repo,
          pull_number: input.pullNumber,
          state: "open",
        }),
      "pulls.update(reopen)"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
