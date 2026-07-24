import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface CommentOnIssueInput {
  owner: string;
  repo: string;
  issueNumber: number;
  body: string;
}

const ACTION = "issues.comment";

export async function commentOnIssue(actor: GithubActorContext, input: CommentOnIssueInput) {
  const target = `${input.owner}/${input.repo}#${input.issueNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "read");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.issues.createComment({
          owner: input.owner,
          repo: input.repo,
          issue_number: input.issueNumber,
          body: input.body,
        }),
      "issues.createComment"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
