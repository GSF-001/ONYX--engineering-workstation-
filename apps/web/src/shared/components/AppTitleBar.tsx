interface AppTitleBarProps {
  appName: string;
  context: string;
  version?: string;
}

/**
 * Standard title bar for every application window: "{APPNAME} v1.0.0 -
 * CONNECTED TO: {CONTEXT}". Every *Window.tsx should render this instead
 * of a custom title string, so the whole desktop reads consistently.
 * Actual minimize/maximize/close buttons are handled separately by
 * window-manager/WindowHeader.tsx — this is just the label content shown
 * inside that bar via the WindowInstance's `title` field, OR rendered as
 * a secondary bar directly under the OS-level title bar for apps that
 * want the repo/context visible even when unfocused. Used here as a
 * secondary strip, matching the mockup's "REPOSITORY: ... LAST SYNC: ..."
 * band under the real titlebar.
 */
export function AppTitleBar({ appName, context, version = "v1.0.0" }: AppTitleBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 10px",
        fontSize: 11,
        fontFamily: "var(--win-font-mono)",
        background: "var(--win-face-light)",
        borderBottom: "1px solid var(--win-face-dark)",
        color: "var(--win-text-dim)",
      }}
    >
      <strong style={{ color: "var(--win-text)" }}>
        {appName.toUpperCase()} {version}
      </strong>
      <span>- CONNECTED TO: {context}</span>
    </div>
  );
}
