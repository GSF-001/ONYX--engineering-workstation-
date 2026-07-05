import { playSequence } from "./SoundManager";

export function playSuccess(): void {
  playSequence([
    { frequency: 660, durationMs: 70, gain: 0.05 },
    { frequency: 990, durationMs: 100, gain: 0.05, delayMs: 70 },
  ]);
}
