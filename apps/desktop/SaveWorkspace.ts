import type { WindowInstance } from "../window-manager/WindowContext";
import { upsertWorkspace } from "./WorkspaceManager";

export function saveWorkspace(name: string, windows: WindowInstance[]): void {
  upsertWorkspace({ name, windows, savedAt: new Date().toISOString() });
}
