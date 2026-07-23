import { db } from "../db/client";
import { logger } from "../services/logger";
import { broadcast } from "../websocket/broadcast";

/**
 * onLabel.ts
 * Handles GitHub's `label` webhook event (repository label created,
 * edited, or deleted). Keeps ONYX's local label registry — used by
 * Issues/Labels.tsx and PullRequests/Labels.tsx — in sync live.
 * Docs: https://docs.github.com/en/webhooks/webhook-events-and-payloads#label
 */

type LabelAction = "created" | "edited" | "deleted";

interface GithubLabel {
  id: number;
  name: string;
  color: string;
  description: string | null;
  default: boolean;
}

interface GithubRepository {
  id: number;
  full_name: string;
  name: string;
}

interface LabelChanges {
  name?: { from: string };
  color?: { from: string };
  description?: { from: string | null };
}

export interface LabelWebhookPayload {
  action: LabelAction;
  label: GithubLabel;
  changes?: LabelChanges;
  repository: GithubRepository;
  sender: { login: string; id: number };
}

export async function onLabel(payload: LabelWebhookPayload): Promise<void> {
  const { action, label, changes, repository } = payload;

  logger.info("webhook.onLabel: received", {
    action,
    repo: repository.full_name,
    label: label.name,
  });

  switch (action) {
    case "created": {
      await db.query(
        `insert into labels (github_id, repository_id, name, color, description, is_default, updated_at)
         values ($1, $2, $3, $4, $5, $6, now())
         on conflict (github_id) do update set
           name = excluded.name,
           color = excluded.color,
           description = excluded.description,
           updated_at = now()`,
        [label.id, repository.id, label.name, label.color, label.description, label.default],
      );
      break;
    }
    case "edited": {
      await db.query(
        `update labels
         set name = $1, color = $2, description = $3, updated_at = now()
         where github_id = $4 and repository_id = $5`,
        [label.name, label.color, label.description, label.id, repository.id],
      );

      // GitHub renames a label in place across every issue/PR that used it;
      // if the name changed, keep any locally cached label snapshots on
      // issues/PRs consistent instead of showing the stale name.
      if (changes?.name?.from) {
        await db.query(
          `update issue_labels set label_name = $1 where label_id = $2`,
          [label.name, label.id],
        );
        await db.query(
          `update pull_request_labels set label_name = $1 where label_id = $2`,
          [label.name, label.id],
        );
      }
      break;
    }
    case "deleted": {
      await db.query(`delete from labels where github_id = $1 and repository_id = $2`, [
        label.id,
        repository.id,
      ]);
      break;
    }
  }

  broadcast(`repo:${repository.id}:labels`, {
    event: "label.updated",
    action,
    label: {
      id: label.id,
      name: label.name,
      color: label.color,
      description: label.description,
    },
    previousName: changes?.name?.from ?? null,
    repository: { id: repository.id, fullName: repository.full_name },
  });

  logger.info("webhook.onLabel: processed", { action, label: label.name });
}
