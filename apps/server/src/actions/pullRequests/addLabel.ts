import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface AddLabelToPullRequestInput {
  owner: string;
  repo: string;
  pullNumber: number;
  labels: string[];
}

const ACTION = "pulls.addLabel";

/** PR labels are managed through the Issues API (PRs are issues under the hood). */
export async function addLabelToPullRequest(actor: GithubActorContext, input: AddLabelToPullRequestInput) {
  const target = `${input.owner}/${input.repo}#${input.pullNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "triage");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.issues.addLabels({
          owner: input.owner,
          repo: input.repo,
          issue_number: input.pullNumber,
          labels: input.labels,
        }),
      "issues.addLabels"
    );

    await recordActionResult({ actor, action: ACTION, target, metadata: { labels: input.labels } });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
