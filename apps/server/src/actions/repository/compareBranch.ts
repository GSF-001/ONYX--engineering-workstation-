import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface CompareBranchInput {
  owner: string;
  repo: string;
  base: string;
  head: string;
}

const ACTION = "repository.compareBranch";

/**
 * Read-only comparison, included here (alongside the write actions)
 * because callers commonly need to diff branches before deciding
 * whether to merge/delete/create a release.
 */
export async function compareBranch(actor: GithubActorContext, input: CompareBranchInput) {
  const target = `${input.owner}/${input.repo}:${input.base}...${input.head}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "read");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.repos.compareCommits({
          owner: input.owner,
          repo: input.repo,
          base: input.base,
          head: input.head,
        }),
      "repos.compareCommits"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return {
      aheadBy: data.ahead_by,
      behindBy: data.behind_by,
      status: data.status,
      totalCommits: data.total_commits,
      files: data.files,
    };
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
