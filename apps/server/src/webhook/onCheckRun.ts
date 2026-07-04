import { db } from "../db/client.js";
import { checkRuns } from "../db/schema.js";
import { getRepositoryByFullName } from "../db/queries.js";
import type { ParsedWebhookEvent } from "./parser.js";
import { broadcastToRoom } from "../websocket/broadcast.js";
import { logger } from "../services/logger.js";

interface GhCheckRunPayload {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  head_sha: string;
  started_at: string | null;
  completed_at: string | null;
}

export async function handleCheckRun(event: ParsedWebhookEvent): Promise<void> {
  const repoFullName = event.repositoryFullName;
  if (!repoFullName) return;

  const repo = await getRepositoryByFullName(repoFullName);
  if (!repo) {
    logger.warn({ repoFullName }, "check_run event for unknown repository, ignoring");
    return;
  }

  const checkRun = event.raw.check_run as GhCheckRunPayload | undefined;
  if (!checkRun) return;

  await db
    .insert(checkRuns)
    .values({
      repositoryId: repo.id,
      githubCheckRunId: checkRun.id,
      name: checkRun.name,
      status: checkRun.status,
      conclusion: checkRun.conclusion,
      headSha: checkRun.head_sha,
      startedAt: checkRun.started_at ? new Date(checkRun.started_at) : null,
      completedAt: checkRun.completed_at ? new Date(checkRun.completed_at) : null,
    })
    .onConflictDoUpdate({
      target: checkRuns.githubCheckRunId,
      set: {
        status: checkRun.status,
        conclusion: checkRun.conclusion,
        completedAt: checkRun.completed_at ? new Date(checkRun.completed_at) : null,
      },
    });

  broadcastToRoom(`repository:${repo.id}`, {
    type: "check_run.updated",
    repositoryId: repo.id,
    name: checkRun.name,
    status: checkRun.status,
    conclusion: checkRun.conclusion,
  });
}
