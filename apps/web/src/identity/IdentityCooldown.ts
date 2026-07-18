import type { CooldownStatus } from "./IdentityTypes";

export function formatCooldownRemaining(status: CooldownStatus): string | null {
  if (status.canChange || !status.nextChangeAt) return null;

  const remainingMs = new Date(status.nextChangeAt).getTime() - Date.now();
  const days = Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
  return `${days} day${days === 1 ? "" : "s"}`;
}
