import { getTeamMembership } from "../db/queries.js";

export type Role = "owner" | "admin" | "member";

const ROLE_RANK: Record<Role, number> = { member: 0, admin: 1, owner: 2 };

export function roleAtLeast(role: Role, minimum: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export async function userHasTeamRole(
  userId: number,
  teamId: number,
  minimumRole: Role = "member"
): Promise<boolean> {
  const membership = await getTeamMembership(teamId, userId);
  if (!membership) return false;
  return roleAtLeast(membership.role as Role, minimumRole);
}
