import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface RemoveLabelFromIssueInput {
  owner: string;
  repo: string;
  issueNumber: number;
  label: string;
}

const ACTION = "issues.removeLabel";

export async function removeLabelFromIssue(actor: GithubActorContext, input: RemoveLabelFromIssueInput) {
  const target = `${input.owner}/${input.repo}#${input.issueNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "triage");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.issues.removeLabel({
          owner: input.owner,
          repo: input.repo,
          issue_number: input.issueNumber,
          name: input.label,
        }),
      "issues.removeLabel"
    );

    await recordActionResult({ actor, action: ACTION, target, metadata: { label: input.label } });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
