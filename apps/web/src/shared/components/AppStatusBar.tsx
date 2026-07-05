import type { ReactNode } from "react";

interface AppStatusBarProps {
  segments: ReactNode[];
}

/**
 * Standard bottom status strip for windows that want one (Bounties would
 * say "READY | 124 PLUGINS | ..."; here it's used generically — pass
 * whatever segments are relevant, joined with the same visual separator
 * so every window's status bar looks like it belongs to the same OS.
 */
export function AppStatusBar({ segments }: AppStatusBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: 22,
        padding: "0 10px",
        fontSize: 11,
        color: "var(--win-text-dim)",
        background: "var(--win-face)",
        borderTop: "1px solid var(--win-face-dark)",
      }}
    >
      {segments.map((segment, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {i > 0 && <span style={{ opacity: 0.4 }}>|</span>}
          {segment}
        </span>
      ))}
    </div>
  );
}
