import { getActivityFeed, getDashboard, getPullRequests, syncRepository } from "../../shared/api";
import type { DashboardPrTrendPoint } from "./DashboardTypes";

/**
 * Thin domain-specific wrapper over shared/api — every app's *API.ts
 * follows this pattern instead of calling shared/api endpoints directly
 * from components, so the fetch shape used by this window stays in one
 * place if it needs to change.
 */
export const DashboardAPI = {
  getDashboard: (teamSlug: string) => getDashboard(teamSlug),
  syncRepository: (repositoryId: number) => syncRepository(repositoryId),
  getActivity: (repositoryId: number) => getActivityFeed(repositoryId),

  /**
   * There's no server-side score history table yet, so a real "14-day
   * trend" chart isn't available. This computes an honest proxy instead:
   * PR open/merge counts per day over the last 14 days, from real PR
   * timestamps already returned by the pull-requests endpoint.
   */
  async getPrTrend(repositoryId: number, days = 14): Promise<DashboardPrTrendPoint[]> {
    const prs = await getPullRequests(repositoryId);
    const since = Date.now() - days * 24 * 60 * 60 * 1000;

    const buckets = new Map<string, DashboardPrTrendPoint>();
    for (let i = 0; i < days; i++) {
      const date = new Date(since + i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      buckets.set(date, { date, opened: 0, merged: 0 });
    }

    for (const pr of prs) {
      const openedDate = pr.createdAt.slice(0, 10);
      if (buckets.has(openedDate)) buckets.get(openedDate)!.opened += 1;

      if (pr.mergedAt) {
        const mergedDate = pr.mergedAt.slice(0, 10);
        if (buckets.has(mergedDate)) buckets.get(mergedDate)!.merged += 1;
      }
    }

    return Array.from(buckets.values());
  },
};
