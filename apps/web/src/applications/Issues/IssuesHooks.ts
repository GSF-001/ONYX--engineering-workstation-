import { useCallback, useEffect, useState } from "react";
import { IssuesAPI } from "./IssuesAPI";
import { getActiveRepositoryId } from "./IssuesStore";
import type { IssuesViewState } from "./IssuesTypes";

export function useIssuesData() {
  const [state, setState] = useState<IssuesViewState>({ graveyard: [], loading: true, error: null });

  const load = useCallback(async () => {
    const repositoryId = getActiveRepositoryId();
    if (!repositoryId) {
      setState({ graveyard: [], loading: false, error: "No repository selected." });
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const graveyard = await IssuesAPI.getGraveyard(repositoryId);
      setState({ graveyard, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load issues.",
      }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
