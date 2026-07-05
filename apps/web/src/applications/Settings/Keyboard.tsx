const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "Ctrl / ⌘ + K", action: "Open command palette" },
  { keys: "Ctrl / ⌘ + W", action: "Close focused window" },
  { keys: "Alt + Tab", action: "Cycle focus between open windows" },
  { keys: "Esc", action: "Restore a maximized window" },
  { keys: "↑ / ↓ (in Terminal)", action: "Navigate command history" },
  { keys: "Tab (in Terminal)", action: "Autocomplete command" },
];

/** Purely informational — every shortcut listed here is already wired up
 * (WindowShortcuts.ts, useCommandPalette.ts, terminal/Terminal.tsx). */
export function Keyboard() {
  return (
    <div style={{ padding: 16 }}>
      {SHORTCUTS.map((s) => (
        <div key={s.keys} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--win-face-dark)" }}>
          <span style={{ fontSize: 12, fontFamily: "var(--win-font-mono)" }}>{s.keys}</span>
          <span style={{ fontSize: 12, color: "var(--win-text-dim)" }}>{s.action}</span>
        </div>
      ))}
    </div>
  );
}
