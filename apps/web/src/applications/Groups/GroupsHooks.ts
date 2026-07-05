import { useCallback, useEffect, useState } from "react";
import { GroupsAPI } from "./GroupsAPI";
import type { GroupsViewState } from "./GroupsTypes";

export function useGroupsData() {
  const [state, setState] = useState<GroupsViewState>({ publicGroups: [], anonymousGroups: [], myGroups: [], loading: true, error: null });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [publicGroups, anonymousGroups, myGroups] = await Promise.all([
        GroupsAPI.getPublic(),
        GroupsAPI.getAnonymous(),
        GroupsAPI.getMine(),
      ]);
      setState({ publicGroups, anonymousGroups, myGroups: myGroups.map((r: any) => r.group ?? r), loading: false, error: null });
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err instanceof Error ? err.message : "Failed to load groups." }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
