import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface CreateRepositoryReleaseInput {
  owner: string;
  repo: string;
  tagName: string;
  targetCommitish?: string;
  name?: string;
  body?: string;
  prerelease?: boolean;
}

const ACTION = "repository.createRelease";

/**
 * Creates a fully published release directly. For a draft-first
 * workflow use releases/draft.ts instead.
 */
export async function createRepositoryRelease(actor: GithubActorContext, input: CreateRepositoryReleaseInput) {
  const target = `${input.owner}/${input.repo}@${input.tagName}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.repos.createRelease({
          owner: input.owner,
          repo: input.repo,
          tag_name: input.tagName,
          target_commitish: input.targetCommitish,
          name: input.name ?? input.tagName,
          body: input.body,
          prerelease: input.prerelease ?? false,
          draft: false,
        }),
      "repos.createRelease"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
