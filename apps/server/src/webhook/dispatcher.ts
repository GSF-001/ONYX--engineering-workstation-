import type { ParsedWebhookEvent } from "./parser.js";
import { handlePush } from "./onPush.js";
import { handlePullRequest } from "./onPullRequest.js";
import { handleReview } from "./onReview.js";
import { handleIssue } from "./onIssue.js";
import { handleCheckRun } from "./onCheckRun.js";
import { logger } from "../services/logger.js";

type Handler = (event: ParsedWebhookEvent) => Promise<void>;

const HANDLERS: Record<string, Handler> = {
  push: handlePush,
  pull_request: handlePullRequest,
  pull_request_review: handleReview,
  issues: handleIssue,
  check_run: handleCheckRun,
};

export async function dispatchWebhookEvent(event: ParsedWebhookEvent): Promise<void> {
  const handler = HANDLERS[event.event];
  if (!handler) {
    logger.debug({ event: event.event }, "No handler registered for webhook event, skipping");
    return;
  }
  await handler(event);
}
