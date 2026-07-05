import { useCallback, useEffect, useState } from "react";
import { ReviewsAPI } from "./ReviewsAPI";
import { getActiveRepositoryId } from "./ReviewsStore";
import type { ReviewsViewState } from "./ReviewsTypes";
import { useSocketEvent } from "../../shared/hooks";

export function useReviewsData() {
  const [state, setState] = useState<ReviewsViewState>({
    reviewerLoad: [],
    reciprocityGap: [],
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    const repositoryId = getActiveRepositoryId();
    if (!repositoryId) {
      setState({ reviewerLoad: [], reciprocityGap: [], loading: false, error: "No repository selected." });
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [reviewerLoad, reciprocityGap] = await Promise.all([
        ReviewsAPI.getReviewerLoad(repositoryId),
        ReviewsAPI.getReciprocityGap(repositoryId),
      ]);
      setState({ reviewerLoad, reciprocityGap, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load review data.",
      }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useSocketEvent("review.created", () => void load());

  return { ...state, reload: load };
}
