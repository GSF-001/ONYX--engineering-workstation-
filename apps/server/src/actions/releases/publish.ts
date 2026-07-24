import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface PublishReleaseInput {
  owner: string;
  repo: string;
  releaseId: number;
}

const ACTION = "releases.publish";

/** Publishes an existing draft release by flipping draft:false. */
export async function publishRelease(actor: GithubActorContext, input: PublishReleaseInput) {
  const target = `${input.owner}/${input.repo}#release:${input.releaseId}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.repos.updateRelease({
          owner: input.owner,
          repo: input.repo,
          release_id: input.releaseId,
          draft: false,
        }),
      "repos.updateRelease(publish)"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
