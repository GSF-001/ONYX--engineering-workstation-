/**
 * Reveals `text` one character at a time, calling `onTick` with the
 * progressively longer substring. Returns a cancel function.
 */
export function typewriter(
  text: string,
  onTick: (partial: string) => void,
  charDelayMs = 12
): () => void {
  let index = 0;
  let cancelled = false;

  const step = () => {
    if (cancelled) return;
    index += 1;
    onTick(text.slice(0, index));
    if (index < text.length) {
      setTimeout(step, charDelayMs);
    }
  };

  step();
  return () => {
    cancelled = true;
  };
}

/** Simple ease-out curve used for the boot progress bar fill. */
export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}
