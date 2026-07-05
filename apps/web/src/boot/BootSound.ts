let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContext = new Ctor();
  }
  return audioContext;
}

function beep(frequency: number, durationMs: number, gainValue = 0.05): void {
  const ctx = getContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "square";
  oscillator.frequency.value = frequency;
  gain.gain.value = gainValue;

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + durationMs / 1000);
}

/** Short blip played on each boot-step tick. */
export function playStepTick(): void {
  beep(880, 40);
}

/** Slightly longer chime played once the boot sequence completes. */
export function playReadyChime(): void {
  beep(660, 90);
  setTimeout(() => beep(990, 130), 90);
}
