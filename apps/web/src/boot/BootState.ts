import { useCallback, useEffect, useRef, useState } from "react";
import { BOOT_SEQUENCE, type BootStep } from "./BootSequence";
import { playStepTick, playReadyChime } from "./BootSound";

export type BootStepStatus = "pending" | "loading" | "ok" | "fail";

export interface BootStepState extends BootStep {
  status: BootStepStatus;
}

export interface UseBootStateResult {
  steps: BootStepState[];
  isComplete: boolean;
}

/**
 * Drives the boot sequence: walks BOOT_SEQUENCE one step at a time, marking
 * each "loading" then "ok" after its duration, and fires `onComplete` once
 * every step has finished.
 */
export function useBootState(onComplete: () => void, playSound = true): UseBootStateResult {
  const [steps, setSteps] = useState<BootStepState[]>(
    BOOT_SEQUENCE.map((step) => ({ ...step, status: "pending" }))
  );
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const runStep = useCallback((index: number) => {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], status: "loading" };
      return next;
    });

    const step = BOOT_SEQUENCE[index];
    setTimeout(() => {
      if (playSound) playStepTick();
      setSteps((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], status: "ok" };
        return next;
      });

      if (index + 1 < BOOT_SEQUENCE.length) {
        runStep(index + 1);
      } else {
        if (playSound) playReadyChime();
        setIsComplete(true);
        onCompleteRef.current();
      }
    }, step.durationMs);
  }, [playSound]);

  useEffect(() => {
    runStep(0);
    // Intentionally runs once — the sequence is a fixed, one-shot animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { steps, isComplete };
}
