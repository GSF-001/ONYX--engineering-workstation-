import { useCallback, useEffect, useState } from "react";
import { RepositoryAPI } from "./RepositoryAPI";
import { getActiveRepositoryId } from "./RepositoryStore";
import type { RepositoryViewState } from "./RepositoryTypes";

export function useRepositoryData() {
  const [state, setState] = useState<RepositoryViewState>({
    repository: null,
    contributors: [],
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    const repositoryId = getActiveRepositoryId();
    if (!repositoryId) {
      setState({ repository: null, contributors: [], loading: false, error: "No repository selected." });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [repository, contributors] = await Promise.all([
        RepositoryAPI.getRepository(repositoryId),
        RepositoryAPI.getContributors(repositoryId),
      ]);
      setState({ repository, contributors, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load repository.",
      }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
