import { getVolume } from "./Volume";

export interface Tone {
  frequency: number;
  durationMs: number;
  type?: OscillatorType;
  gain?: number;
  delayMs?: number;
}

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
  }
  return ctx;
}

function playTone(tone: Tone, startAt: number): void {
  const audioCtx = getContext();
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = tone.type ?? "square";
  oscillator.frequency.value = tone.frequency;
  gainNode.gain.value = (tone.gain ?? 0.06) * getVolume();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start(startAt);
  oscillator.stop(startAt + tone.durationMs / 1000);
}

/**
 * Plays a sequence of tones back to back (each starting after the previous
 * one's delay). Every named sound file in this folder (Click, Boot,
 * WindowOpen, etc) is a thin call into this — one place owns actual Web
 * Audio wiring and volume/mute handling.
 */
export function playSequence(tones: Tone[]): void {
  const audioCtx = getContext();
  if (!audioCtx || getVolume() === 0) return;

  let cursor = audioCtx.currentTime;
  for (const tone of tones) {
    playTone(tone, cursor);
    cursor += (tone.delayMs ?? tone.durationMs) / 1000;
  }
}
