import type { WindowAction } from "./WindowContext";

export function maximizeWindow(dispatch: React.Dispatch<WindowAction>, id: string): void {
  dispatch({ type: "MAXIMIZE", id });
}
