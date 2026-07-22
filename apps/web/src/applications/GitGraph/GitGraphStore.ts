// GitGraphStore.ts
// Minimal external store (subscribe/getState/setState), consumed via
// useSyncExternalStore in GitGraphHooks.ts. No external state library
// dependency, matching the rest of ONYX's lightweight app modules.

import type { GitGraphState } from "./GitGraphTypes";

type Listener = () => void;
type Updater = (state: GitGraphState) => Partial<GitGraphState>;

function createInitialState(): GitGraphState {
  return {
    repositoryName: "onyx-shell",
    commits: [],
    branches: [],
    selectedCommitHash: null,
    selectedFilePath: null,
    filterQuery: "",
    viewport: { panX: 0, panY: 0, zoom: 1 },
  };
}

class GitGraphStoreImpl {
  private state: GitGraphState = createInitialState();
  private listeners = new Set<Listener>();

  getState = (): GitGraphState => this.state;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  setState = (patch: Partial<GitGraphState> | Updater): void => {
    const next = typeof patch === "function" ? patch(this.state) : patch;
    this.state = { ...this.state, ...next };
    this.listeners.forEach((listener) => listener());
  };

  reset = (): void => {
    this.state = createInitialState();
    this.listeners.forEach((listener) => listener());
  };
}

export const gitGraphStore = new GitGraphStoreImpl();
export type { GitGraphStoreImpl };
