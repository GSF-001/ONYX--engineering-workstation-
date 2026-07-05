import { playSequence } from "./SoundManager";

export function playDrop(): void {
  playSequence([{ frequency: 300, durationMs: 40, gain: 0.03, type: "triangle" }]);
}
