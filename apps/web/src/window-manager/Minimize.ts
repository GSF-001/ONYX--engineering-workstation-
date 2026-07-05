import type { WindowAction } from "./WindowContext";

export function minimizeWindow(dispatch: React.Dispatch<WindowAction>, id: string): void {
  dispatch({ type: "MINIMIZE", id });
}
