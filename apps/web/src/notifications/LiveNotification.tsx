import { useRef } from "react";
import { usePolling } from "../shared/hooks";
import { useNotifications } from "./NotificationManager";
import { PullRequestNotificationBody } from "./PullRequestNotification";
import { ReviewNotificationBody } from "./ReviewNotification";
import { playNotification, playLiveSyncTick } from "../audio";
import { getActivityFeed } from "../shared/api";
import { getActiveRepositoryId } from "../applications/Dashboard/DashboardStore";
import type { TimelineEvent } from "../shared/types";

/**
 * Polling replacement for the old websocket-driven LiveNotification.
 * Fetches the activity feed every few seconds and diffs against the last
 * seen timestamp per pull request, turning new "reviewed" events into
 * review toasts and new "merged"/"closed" events into PR-update toasts.
 *
 * Honest gap: check_run.updated has no polling source. The old websocket
 * version reacted to check-run completion in real time; there's no
 * GET /repositories/:id/check-runs endpoint to poll instead, so that
 * notification type is dropped here rather than faked.
 */
export function LiveNotification() {
  const { add } = useNotifications();
  const lastSeenAtRef = useRef<string | null>(null);

  usePolling(async () => {
    const repositoryId = getActiveRepositoryId();
    if (!repositoryId) return;

    const feed = await getActivityFeed(repositoryId);
    const entries = feed.flatMap((entry) =>
      entry.events.map((event) => ({ ...event, pullRequestNumber: entry.pullRequestNumber }))
    );

    const sorted = entries.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
    const cutoff = lastSeenAtRef.current;
    const freshEvents = cutoff ? sorted.filter((e) => new Date(e.at) > new Date(cutoff)) : [];

    for (const event of freshEvents) {
      if (event.type === "reviewed") {
        playNotification();
        add({
          tone: "info",
          title: "New review",
          body: (
            <ReviewNotificationBody
              reviewer={event.actor}
              pullRequestNumber={event.pullRequestNumber}
              state={event.detail ?? "commented"}
            />
          ),
          autoDismissMs: 5000,
        });
      } else if (event.type === "merged" || event.type === "closed" || event.type === "opened") {
        playLiveSyncTick();
        add({
          tone: "info",
          title: "Pull request updated",
          body: <PullRequestNotificationBody number={event.pullRequestNumber} action={event.type} />,
          autoDismissMs: 5000,
        });
      }
    }

    if (sorted.length > 0) {
      lastSeenAtRef.current = sorted[sorted.length - 1].at;
    }
  }, 10000);

  return null;
}
