import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface PinIssueInput {
  owner: string;
  repo: string;
  issueNumber: number;
  pinned: boolean;
}

const ACTION = "issues.pin";

/**
 * Pins or unpins an issue. REST has no endpoint for this — it
 * requires the `pinIssue` / `unpinIssue` GraphQL mutations operating
 * on the issue's GraphQL node id.
 */
export async function setIssuePinned(actor: GithubActorContext, input: PinIssueInput) {
  const target = `${input.owner}/${input.repo}#${input.issueNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);

    const { data: issue } = await callGithub(
      () => client.issues.get({ owner: input.owner, repo: input.repo, issue_number: input.issueNumber }),
      "issues.get"
    );

    const mutation = input.pinned
      ? `mutation($issueId: ID!) { pinIssue(input: { issueId: $issueId }) { issue { id isPinned } } }`
      : `mutation($issueId: ID!) { unpinIssue(input: { issueId: $issueId }) { issue { id isPinned } } }`;

    const result = await callGithub(
      () =>
        client.graphql<any>(mutation, { issueId: (issue as any).node_id }),
      input.pinned ? "graphql.pinIssue" : "graphql.unpinIssue"
    );

    await recordActionResult({ actor, action: ACTION, target, metadata: { pinned: input.pinned } });
    return input.pinned ? result.pinIssue.issue : result.unpinIssue.issue;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
