import { useEffect, useRef } from "react";

export interface ConsoleLine {
  id: string;
  text: string;
  tone?: "default" | "echo" | "error";
}

interface ConsoleProps {
  lines: ConsoleLine[];
}

const TONE_COLOR: Record<NonNullable<ConsoleLine["tone"]>, string> = {
  default: "var(--win-text)",
  echo: "var(--win-accent)",
  error: "var(--win-danger)",
};

export function Console({ lines }: ConsoleProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines.length]);

  return (
    <div style={{ fontFamily: "var(--win-font-mono)", fontSize: 13, whiteSpace: "pre-wrap" }}>
      {lines.map((line) => (
        <div key={line.id} style={{ color: TONE_COLOR[line.tone ?? "default"] }}>
          {line.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
