import { useCallback } from "react";
import { useWindowContext } from "./WindowContext";
import { openSingletonWindow, openWindow } from "./Open";
import { closeWindow } from "./Close";
import { focusWindow } from "./Focus";
import { minimizeWindow } from "./Minimize";
import { maximizeWindow } from "./Maximize";
import { restoreWindow } from "./Restore";
import { WINDOW_REGISTRY } from "./WindowRegistry";

/**
 * The convenience hook most components should use — wraps the raw
 * dispatch-based actions with bound callbacks and exposes read access to
 * the window list.
 */
export function useWindowManager() {
  const { state, dispatch } = useWindowContext();

  const open = useCallback(
    (appId: string) => {
      const def = WINDOW_REGISTRY[appId];
      if (!def) throw new Error(`Unknown appId "${appId}" — add it to WINDOW_REGISTRY first.`);
      return openSingletonWindow(dispatch, appId, def.title);
    },
    [dispatch]
  );

  const openMultiple = useCallback(
    (appId: string, title: string) => openWindow(dispatch, appId, title),
    [dispatch]
  );

  return {
    windows: state.windows,
    focusedId: state.focusedId,
    open,
    openMultiple,
    close: (id: string) => closeWindow(dispatch, id),
    focus: (id: string) => focusWindow(dispatch, id),
    minimize: (id: string) => minimizeWindow(dispatch, id),
    maximize: (id: string) => maximizeWindow(dispatch, id),
    restore: (id: string) => restoreWindow(dispatch, id),
    move: (id: string, x: number, y: number) => dispatch({ type: "MOVE", id, x, y }),
    resize: (id: string, width: number, height: number) => dispatch({ type: "RESIZE", id, width, height }),
  };
}
