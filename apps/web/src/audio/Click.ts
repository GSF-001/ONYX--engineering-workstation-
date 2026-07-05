import { playSequence } from "./SoundManager";

export function playClick(): void {
  playSequence([{ frequency: 1200, durationMs: 20, gain: 0.03 }]);
}
