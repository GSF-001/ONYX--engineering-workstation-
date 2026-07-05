import { useCallback, useEffect, useState } from "react";
import { PullRequestAPI } from "./PullRequestAPI";
import { getActiveRepositoryId } from "./PullRequestStore";
import type { PullRequestViewState } from "./PullRequestTypes";
import { useSocketEvent } from "../../shared/hooks";

export function usePullRequestData() {
  const [state, setState] = useState<PullRequestViewState>({ pullRequests: [], loading: true, error: null });

  const load = useCallback(async () => {
    const repositoryId = getActiveRepositoryId();
    if (!repositoryId) {
      setState({ pullRequests: [], loading: false, error: "No repository selected." });
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const pullRequests = await PullRequestAPI.list(repositoryId);
      setState({ pullRequests, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load pull requests.",
      }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useSocketEvent("pull_request.updated", () => void load());

  return { ...state, reload: load };
}

export function usePullRequestTimeline(pullRequestId: number | null) {
  const [events, setEvents] = useState<PullRequestViewState["pullRequests"][number]["id"] extends never ? never : any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const repositoryId = getActiveRepositoryId();
    if (!pullRequestId || !repositoryId) {
      setEvents([]);
      return;
    }
    setLoading(true);
    PullRequestAPI.timeline(repositoryId, pullRequestId)
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [pullRequestId]);

  return { events, loading };
}
