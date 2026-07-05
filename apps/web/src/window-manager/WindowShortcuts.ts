import { useEffect } from "react";
import type { WindowAction, WindowState } from "./WindowContext";
import { WindowHistory } from "./WindowHistory";

/**
 * Global keyboard shortcuts for the window manager: Ctrl/Cmd+W closes the
 * focused window, Alt+Tab cycles focus between open windows, Escape
 * restores a maximized focused window.
 */
export function useWindowShortcuts(
  state: WindowState,
  dispatch: React.Dispatch<WindowAction>,
  history: WindowHistory
): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const focused = state.windows.find((w) => w.id === state.focusedId);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "w" && focused) {
        e.preventDefault();
        dispatch({ type: "CLOSE", id: focused.id });
        return;
      }

      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        const nextId = history.next(state.focusedId);
        if (nextId) dispatch({ type: "FOCUS", id: nextId });
        return;
      }

      if (e.key === "Escape" && focused?.maximized) {
        dispatch({ type: "RESTORE", id: focused.id });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state, dispatch, history]);
}
