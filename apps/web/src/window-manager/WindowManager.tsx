import { useMemo } from "react";
import { WindowContextProvider, useWindowContext } from "./WindowContext";
import { WindowFrame } from "./WindowFrame";
import { useWindowShortcuts } from "./WindowShortcuts";
import { WindowHistory } from "./WindowHistory";
import { WINDOW_OPEN_ANIMATION_CSS, WINDOW_MINIMIZE_ANIMATION_CSS } from "./WindowAnimation";

function WindowManagerInner() {
  const { state, dispatch } = useWindowContext();
  const history = useMemo(() => new WindowHistory(), []);

  useWindowShortcuts(state, dispatch, history);

  return (
    <>
      <style>
        {WINDOW_OPEN_ANIMATION_CSS}
        {WINDOW_MINIMIZE_ANIMATION_CSS}
      </style>
      {state.windows.map((instance) => (
        <WindowFrame key={instance.id} instance={instance} />
      ))}
    </>
  );
}

/**
 * Top-level provider + renderer for the whole window system. Mount once,
 * near the top of the desktop page — everything else (DesktopIcon,
 * terminal `open <app>` command, etc) talks to it through useWindowManager().
 */
export function WindowManager({ children }: { children?: React.ReactNode }) {
  return (
    <WindowContextProvider>
      {children}
      <WindowManagerInner />
    </WindowContextProvider>
  );
}
