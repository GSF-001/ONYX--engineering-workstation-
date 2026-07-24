import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface AssignReviewerInput {
  owner: string;
  repo: string;
  pullNumber: number;
  reviewers?: string[];
  teamReviewers?: string[];
}

const ACTION = "pulls.assignReviewer";

export async function assignReviewer(actor: GithubActorContext, input: AssignReviewerInput) {
  const target = `${input.owner}/${input.repo}#${input.pullNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.pulls.requestReviewers({
          owner: input.owner,
          repo: input.repo,
          pull_number: input.pullNumber,
          reviewers: input.reviewers,
          team_reviewers: input.teamReviewers,
        }),
      "pulls.requestReviewers"
    );

    await recordActionResult({
      actor,
      action: ACTION,
      target,
      metadata: { reviewers: input.reviewers, teamReviewers: input.teamReviewers },
    });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
