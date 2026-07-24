import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface MarkReadyForReviewInput {
  owner: string;
  repo: string;
  pullNumber: number;
}

const ACTION = "pulls.readyForReview";

/**
 * Marks a draft PR as ready for review. Uses the
 * `markPullRequestReadyForReview` GraphQL mutation since the REST API
 * does not expose this transition directly.
 */
export async function markReadyForReview(actor: GithubActorContext, input: MarkReadyForReviewInput) {
  const target = `${input.owner}/${input.repo}#${input.pullNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);

    const { data: pr } = await callGithub(
      () => client.pulls.get({ owner: input.owner, repo: input.repo, pull_number: input.pullNumber }),
      "pulls.get"
    );

    const result = await callGithub(
      () =>
        client.graphql<{ markPullRequestReadyForReview: { pullRequest: { id: string; isDraft: boolean } } }>(
          `mutation($pullRequestId: ID!) {
            markPullRequestReadyForReview(input: { pullRequestId: $pullRequestId }) {
              pullRequest { id isDraft }
            }
          }`,
          { pullRequestId: (pr as any).node_id }
        ),
      "graphql.markPullRequestReadyForReview"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return result.markPullRequestReadyForReview.pullRequest;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
