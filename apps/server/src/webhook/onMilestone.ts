import { db } from "../db/client";
import { logger } from "../services/logger";
import { broadcast } from "../websocket/broadcast";
import { createNotification } from "../services/notifications";

/**
 * onMilestone.ts
 * Handles GitHub's `milestone` webhook event (created, closed, opened,
 * edited, deleted). Feeds Issues/Milestones.tsx and Projects/Milestones.tsx.
 * Docs: https://docs.github.com/en/webhooks/webhook-events-and-payloads#milestone
 */

type MilestoneAction = "created" | "closed" | "opened" | "edited" | "deleted";

interface GithubMilestone {
  id: number;
  number: number;
  title: string;
  description: string | null;
  state: "open" | "closed";
  open_issues: number;
  closed_issues: number;
  due_on: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  html_url: string;
  creator: { login: string; id: number };
}

interface GithubRepository {
  id: number;
  full_name: string;
  name: string;
}

interface MilestoneChanges {
  title?: { from: string };
  description?: { from: string | null };
  due_on?: { from: string | null };
}

export interface MilestoneWebhookPayload {
  action: MilestoneAction;
  milestone: GithubMilestone;
  changes?: MilestoneChanges;
  repository: GithubRepository;
  sender: { login: string; id: number };
}

export async function onMilestone(payload: MilestoneWebhookPayload): Promise<void> {
  const { action, milestone, repository } = payload;

  logger.info("webhook.onMilestone: received", {
    action,
    repo: repository.full_name,
    milestone: milestone.title,
  });

  if (action === "deleted") {
    await db.query(`delete from milestones where github_id = $1 and repository_id = $2`, [
      milestone.id,
      repository.id,
    ]);
  } else {
    await db.query(
      `insert into milestones (
         github_id, repository_id, number, title, description, state,
         open_issues, closed_issues, due_on, creator_login, html_url,
         created_at, closed_at, updated_at
       ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, now())
       on conflict (github_id) do update set
         title = excluded.title,
         description = excluded.description,
         state = excluded.state,
         open_issues = excluded.open_issues,
         closed_issues = excluded.closed_issues,
         due_on = excluded.due_on,
         closed_at = excluded.closed_at,
         updated_at = now()`,
      [
        milestone.id,
        repository.id,
        milestone.number,
        milestone.title,
        milestone.description,
        milestone.state,
        milestone.open_issues,
        milestone.closed_issues,
        milestone.due_on,
        milestone.creator.login,
        milestone.html_url,
        milestone.created_at,
        milestone.closed_at,
      ],
    );
  }

  if (action === "closed") {
    await createNotification({
      type: "milestone_closed",
      repositoryId: repository.id,
      title: `Milestone "${milestone.title}" closed in ${repository.full_name}`,
      body: `${milestone.closed_issues} closed / ${milestone.open_issues} still open`,
      url: milestone.html_url,
    });
  }

  broadcast(`repo:${repository.id}:milestones`, {
    event: "milestone.updated",
    action,
    milestone: {
      id: milestone.id,
      number: milestone.number,
      title: milestone.title,
      state: milestone.state,
      openIssues: milestone.open_issues,
      closedIssues: milestone.closed_issues,
      dueOn: milestone.due_on,
      htmlUrl: milestone.html_url,
    },
    repository: { id: repository.id, fullName: repository.full_name },
  });

  logger.info("webhook.onMilestone: processed", { action, milestone: milestone.title });
}
