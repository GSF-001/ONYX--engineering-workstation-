import { Timeline as SharedTimeline } from "../../shared/components";
import type { ActivityFeedEntry, EventTypeFilter } from "./ActivityTypes";

interface ActivityTimelineProps {
  history: ActivityFeedEntry[];
  filter: EventTypeFilter;
}

/** Chronological narrative view (all PRs merged into one feed, newest
 * first) — thin wrapper over the shared Timeline component. */
export function Timeline({ history, filter }: ActivityTimelineProps) {
  const events = history
    .flatMap((entry) => entry.events)
    .filter((event) => filter === "all" || event.type === filter)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return <SharedTimeline events={events} />;
}
