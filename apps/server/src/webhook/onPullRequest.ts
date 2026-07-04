import { db } from "../db/client.js";
import { pullRequests } from "../db/schema.js";
import { getRepositoryByFullName } from "../db/queries.js";
import type { ParsedWebhookEvent } from "./parser.js";
import { broadcastToRoom } from "../websocket/broadcast.js";
import { cache } from "../services/cache.js";
import { logger } from "../services/logger.js";

interface GhPullRequestPayload {
  id: number;
  number: number;
  title: string;
  user: { login: string };
  state: "open" | "closed";
  merged_at: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  additions: number;
  deletions: number;
  changed_files: number;
}

export async function handlePullRequest(event: ParsedWebhookEvent): Promise<void> {
  const repoFullName = event.repositoryFullName;
  if (!repoFullName) return;

  const repo = await getRepositoryByFullName(repoFullName);
  if (!repo) {
    logger.warn({ repoFullName }, "pull_request event for unknown repository, ignoring");
    return;
  }

  const pr = event.raw.pull_request as GhPullRequestPayload | undefined;
  if (!pr) return;

  await db
    .insert(pullRequests)
    .values({
      repositoryId: repo.id,
      githubPrId: pr.id,
      number: pr.number,
      title: pr.title,
      authorLogin: pr.user.login,
      state: pr.merged_at ? "merged" : pr.state,
      additions: pr.additions,
      deletions: pr.deletions,
      changedFiles: pr.changed_files,
      createdAt: new Date(pr.created_at),
      updatedAt: new Date(pr.updated_at),
      mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
      closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
    })
    .onConflictDoUpdate({
      target: pullRequests.githubPrId,
      set: {
        title: pr.title,
        state: pr.merged_at ? "merged" : pr.state,
        updatedAt: new Date(pr.updated_at),
        mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
        closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
        additions: pr.additions,
        deletions: pr.deletions,
        changedFiles: pr.changed_files,
      },
    });

  cache.invalidatePrefix(`analytics:${repo.id}:`);

  broadcastToRoom(`repository:${repo.id}`, {
    type: "pull_request.updated",
    repositoryId: repo.id,
    number: pr.number,
    action: event.action,
  });
}
