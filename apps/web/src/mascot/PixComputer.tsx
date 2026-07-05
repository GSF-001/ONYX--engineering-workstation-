import { HappyFace } from "./Happy";
import { WarningFace } from "./Warning";
import { ErrorFace } from "./Error";
import { IdleFace } from "./Idle";
import { SleepingFace } from "./Sleeping";
import { TalkingFace } from "./Talking";
import type { MascotExpression } from "./Expressions";

interface PixComputerProps {
  expression: MascotExpression;
  size?: number;
}

const FACE_BY_EXPRESSION: Record<MascotExpression, () => JSX.Element> = {
  happy: HappyFace,
  warning: WarningFace,
  error: ErrorFace,
  idle: IdleFace,
  sleeping: SleepingFace,
  talking: TalkingFace,
};

/**
 * The little pixel-computer character that reacts to system state (used
 * in empty states, boot completion, and error screens for personality
 * without needing an illustrator on staff).
 */
export function PixComputer({ expression, size = 48 }: PixComputerProps) {
  const Face = FACE_BY_EXPRESSION[expression];

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" shapeRendering="crispEdges" aria-hidden>
      <rect x="4" y="4" width="24" height="18" fill="#C0C0C0" stroke="#000" />
      <rect x="7" y="7" width="18" height="12" fill="#DFF5EE" />
      <Face />
      <rect x="12" y="24" width="8" height="3" fill="#808080" />
      <rect x="8" y="28" width="16" height="2" fill="#404040" />
    </svg>
  );
}
