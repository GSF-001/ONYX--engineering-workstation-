// Heatmap/ActivityHeatmap.tsx
import { EmptyState } from "../../shared/components";

/** Honest gap: combining commits + reviews + issues + PRs into one
 * heatmap (as the mockup's legend implies) isn't built server-side. */
export function ActivityHeatmap() {
  return (
    <EmptyState
      title="Combined activity heatmap isn't computed yet"
      description="Would need a backend function merging commits, reviews, issues, and PR events into one day/hour grid — only the commit-only version exists today."
    />
  );
}
