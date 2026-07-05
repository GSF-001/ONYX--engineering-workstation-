import { cssForCursor, type CursorName } from "./CursorTheme";

/**
 * Applies a cursor to the whole document (for global states like "busy")
 * rather than per-element — most cursor changes in this app (resize, move)
 * are already handled by CSS on the specific element, this is for
 * app-wide overrides like a loading operation blocking interaction.
 */
export function setGlobalCursor(name: CursorName | null): void {
  document.body.style.cursor = name ? cssForCursor(name) : "";
}

export function withGlobalCursor<T>(name: CursorName, fn: () => T): T {
  setGlobalCursor(name);
  try {
    return fn();
  } finally {
    setGlobalCursor(null);
  }
}

export async function withGlobalCursorAsync<T>(name: CursorName, fn: () => Promise<T>): Promise<T> {
  setGlobalCursor(name);
  try {
    return await fn();
  } finally {
    setGlobalCursor(null);
  }
}
