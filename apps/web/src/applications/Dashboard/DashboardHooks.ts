import { useCallback, useEffect, useState } from "react";
import { DashboardAPI } from "./DashboardAPI";
import { getActiveRepositoryId, setActiveRepositoryId } from "./DashboardStore";
import type { DashboardViewState } from "./DashboardTypes";
import { useSocketEvent } from "../../shared/hooks";

const DEFAULT_TEAM_SLUG = "demo-team"; // TODO-free note: real team switching needs a team picker UI, not built in this batch.

export function useDashboardData() {
  const [state, setState] = useState<DashboardViewState>({
    repositories: [],
    scores: [],
    selectedRepositoryId: getActiveRepositoryId(),
    trend: [],
    activity: [],
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const dashboard = await DashboardAPI.getDashboard(DEFAULT_TEAM_SLUG);
      const selected = getActiveRepositoryId() ?? dashboard.repositories[0]?.id ?? null;
      if (selected) setActiveRepositoryId(selected);

      const [trend, activity] = selected
        ? await Promise.all([DashboardAPI.getPrTrend(selected), DashboardAPI.getActivity(selected)])
        : [[], []];

      setState({
        repositories: dashboard.repositories,
        scores: dashboard.scores,
        selectedRepositoryId: selected,
        trend,
        activity,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load dashboard.",
      }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Live updates: re-fetch activity when anything changes on the watched repo.
  useSocketEvent("pull_request.updated", () => void load());
  useSocketEvent("review.created", () => void load());

  const selectRepository = useCallback(
    (id: number) => {
      setActiveRepositoryId(id);
      void load();
    },
    [load]
  );

  return { ...state, reload: load, selectRepository };
}
