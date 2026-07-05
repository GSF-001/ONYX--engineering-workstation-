import { useCallback, type PointerEvent as ReactPointerEvent } from "react";
import { TOKENS } from "../theme";

type ResizeHandle = "e" | "s" | "se";

interface ResizableProps {
  width: number;
  height: number;
  onResize: (width: number, height: number) => void;
  disabled?: boolean;
}

const HANDLE_SIZE = 8;

/** Renders the edge/corner drag handles for a window and reports new
 * dimensions as the pointer moves, clamped to the theme's minimum size. */
export function Resizable({ width, height, onResize, disabled }: ResizableProps) {
  const startResize = useCallback(
    (handle: ResizeHandle) => (e: ReactPointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = width;
      const startHeight = height;

      const handleMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        const nextWidth = handle.includes("e") ? Math.max(TOKENS.window.minWidth, startWidth + dx) : startWidth;
        const nextHeight = handle.includes("s") ? Math.max(TOKENS.window.minHeight, startHeight + dy) : startHeight;

        onResize(nextWidth, nextHeight);
      };

      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [disabled, width, height, onResize]
  );

  if (disabled) return null;

  return (
    <>
      <div
        onPointerDown={startResize("e")}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: HANDLE_SIZE, cursor: "ew-resize" }}
      />
      <div
        onPointerDown={startResize("s")}
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: HANDLE_SIZE, cursor: "ns-resize" }}
      />
      <div
        onPointerDown={startResize("se")}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: HANDLE_SIZE * 1.5,
          height: HANDLE_SIZE * 1.5,
          cursor: "nwse-resize",
        }}
      />
    </>
  );
}
