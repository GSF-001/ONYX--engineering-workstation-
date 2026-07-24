import { GithubActorContext, clientFromActor, callGithub, GithubClientError } from "./githubWriteClient";

export type RequiredPermission = "read" | "triage" | "write" | "maintain" | "admin";

const PERMISSION_RANK: Record<RequiredPermission, number> = {
  read: 0,
  triage: 1,
  write: 2,
  maintain: 3,
  admin: 4,
};

export class PermissionDeniedError extends GithubClientError {
  constructor(message: string) {
    super(message);
    this.name = "PermissionDeniedError";
  }
}

/**
 * Confirms the acting user has at least `required` permission on the
 * target repository before a write action is allowed to proceed.
 * Throws PermissionDeniedError if the check fails.
 */
export async function assertRepoPermission(
  actor: GithubActorContext,
  owner: string,
  repo: string,
  required: RequiredPermission
): Promise<void> {
  const client = clientFromActor(actor);

  const { data } = await callGithub(
    () =>
      client.repos.getCollaboratorPermissionLevel({
        owner,
        repo,
        username: actor.githubLogin,
      }),
    "repos.getCollaboratorPermissionLevel"
  );

  const actualLevel = (data.permission as RequiredPermission) ?? "read";

  if ((PERMISSION_RANK[actualLevel] ?? -1) < PERMISSION_RANK[required]) {
    throw new PermissionDeniedError(
      `User '${actor.githubLogin}' has '${actualLevel}' permission on ${owner}/${repo}, ` +
        `but '${required}' is required for this action.`
    );
  }
}
