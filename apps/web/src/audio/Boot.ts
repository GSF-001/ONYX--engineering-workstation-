import { playSequence } from "./SoundManager";

export function playBootChime(): void {
  playSequence([
    { frequency: 440, durationMs: 90, gain: 0.05 },
    { frequency: 660, durationMs: 110, gain: 0.05, delayMs: 90 },
    { frequency: 880, durationMs: 160, gain: 0.05, delayMs: 110 },
  ]);
}
