import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface ArchiveRepositoryInput {
  owner: string;
  repo: string;
}

const ACTION = "repository.archive";

/** Archives a repository (read-only, admin-only, irreversible via API without unarchiving separately). */
export async function archiveRepository(actor: GithubActorContext, input: ArchiveRepositoryInput) {
  const target = `${input.owner}/${input.repo}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "admin");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.repos.update({
          owner: input.owner,
          repo: input.repo,
          archived: true,
        }),
      "repos.update(archive)"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
