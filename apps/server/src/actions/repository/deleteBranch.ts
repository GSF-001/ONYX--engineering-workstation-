import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface DeleteBranchInput {
  owner: string;
  repo: string;
  branchName: string;
}

const ACTION = "repository.deleteBranch";

export async function deleteBranch(actor: GithubActorContext, input: DeleteBranchInput) {
  const target = `${input.owner}/${input.repo}:${input.branchName}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    if (input.branchName === "main" || input.branchName === "master") {
      throw new Error(`Refusing to delete protected default-like branch '${input.branchName}'`);
    }

    const client = clientFromActor(actor);
    await callGithub(
      () =>
        client.git.deleteRef({
          owner: input.owner,
          repo: input.repo,
          ref: `heads/${input.branchName}`,
        }),
      "git.deleteRef"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return { deleted: true, branch: input.branchName };
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
