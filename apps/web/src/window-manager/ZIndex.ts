import { TOKENS } from "../theme";

let counter = TOKENS.zIndex.windowBase;

/** Hands out a strictly increasing z-index so "bring to front" is always
 * a simple assignment, never a full re-sort of every open window. */
export function nextZIndex(): number {
  counter += 1;
  return counter;
}

export function resetZIndexCounter(): void {
  counter = TOKENS.zIndex.windowBase;
}
