import { Timeline as SharedTimeline } from "../../shared/components";
import { usePullRequestTimeline } from "./PullRequestHooks";
import { LoadingSpinner } from "../../shared/components";

interface PullRequestTimelineProps {
  pullRequestId: number;
}

/** Thin app-local wrapper — the actual rendering is the shared Timeline
 * component; this just wires up the data fetch for a specific PR. */
export function PullRequestTimeline({ pullRequestId }: PullRequestTimelineProps) {
  const { events, loading } = usePullRequestTimeline(pullRequestId);

  if (loading) return <LoadingSpinner label="Loading timeline..." />;
  return <SharedTimeline events={events} />;
}
