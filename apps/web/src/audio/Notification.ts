import { playSequence } from "./SoundManager";

export function playNotification(): void {
  playSequence([
    { frequency: 880, durationMs: 60, gain: 0.05 },
    { frequency: 1174, durationMs: 80, gain: 0.05, delayMs: 60 },
  ]);
}
