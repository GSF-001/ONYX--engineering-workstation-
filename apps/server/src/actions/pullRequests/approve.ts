import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface ApprovePullRequestInput {
  owner: string;
  repo: string;
  pullNumber: number;
  body?: string;
}

const ACTION = "pulls.approve";

export async function approvePullRequest(actor: GithubActorContext, input: ApprovePullRequestInput) {
  const target = `${input.owner}/${input.repo}#${input.pullNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.pulls.createReview({
          owner: input.owner,
          repo: input.repo,
          pull_number: input.pullNumber,
          event: "APPROVE",
          body: input.body,
        }),
      "pulls.createReview(APPROVE)"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
