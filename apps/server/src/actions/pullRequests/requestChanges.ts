import { GithubActorContext, clientFromActor, callGithub, GithubClientError } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface RequestChangesInput {
  owner: string;
  repo: string;
  pullNumber: number;
  body: string;
}

const ACTION = "pulls.requestChanges";

export async function requestChanges(actor: GithubActorContext, input: RequestChangesInput) {
  const target = `${input.owner}/${input.repo}#${input.pullNumber}`;
  try {
    if (!input.body || input.body.trim().length === 0) {
      throw new GithubClientError("A non-empty body is required when requesting changes");
    }

    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.pulls.createReview({
          owner: input.owner,
          repo: input.repo,
          pull_number: input.pullNumber,
          event: "REQUEST_CHANGES",
          body: input.body,
        }),
      "pulls.createReview(REQUEST_CHANGES)"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
