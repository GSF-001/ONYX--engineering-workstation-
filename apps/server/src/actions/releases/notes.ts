import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface GenerateAndSetReleaseNotesInput {
  owner: string;
  repo: string;
  releaseId: number;
  tagName: string;
  previousTagName?: string;
}

const ACTION = "releases.notes";

/**
 * Auto-generates release notes (GitHub's compare-based changelog)
 * and writes them onto an existing release's body.
 */
export async function generateAndSetReleaseNotes(actor: GithubActorContext, input: GenerateAndSetReleaseNotesInput) {
  const target = `${input.owner}/${input.repo}#release:${input.releaseId}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);

    const { data: generated } = await callGithub(
      () =>
        client.repos.generateReleaseNotes({
          owner: input.owner,
          repo: input.repo,
          tag_name: input.tagName,
          previous_tag_name: input.previousTagName,
        }),
      "repos.generateReleaseNotes"
    );

    const { data } = await callGithub(
      () =>
        client.repos.updateRelease({
          owner: input.owner,
          repo: input.repo,
          release_id: input.releaseId,
          body: generated.body,
          name: generated.name,
        }),
      "repos.updateRelease(notes)"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
