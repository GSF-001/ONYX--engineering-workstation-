import type { WindowAction, WindowBounds } from "./WindowContext";

export function openWindow(
  dispatch: React.Dispatch<WindowAction>,
  appId: string,
  title: string,
  bounds?: Partial<WindowBounds>
): string {
  const id = `${appId}-${Date.now().toString(36)}`;
  dispatch({ type: "OPEN", id, appId, title, bounds });
  return id;
}

/** Opens (or refocuses, if already open) a singleton window per appId —
 * used by desktop icons where double-clicking twice shouldn't spawn two
 * windows of the same app. */
export function openSingletonWindow(
  dispatch: React.Dispatch<WindowAction>,
  appId: string,
  title: string
): string {
  dispatch({ type: "OPEN", id: appId, appId, title });
  return appId;
}
