interface DesktopSettingsProps {
  onResetLayout: () => void;
}

/** Small desktop-scoped settings surfaced from the right-click context
 * menu ("Desktop Settings...") — distinct from the full Settings app,
 * which covers theme/sound/keyboard/about globally. */
export function DesktopSettings({ onResetLayout }: DesktopSettingsProps) {
  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontWeight: 700, marginBottom: 12 }}>Desktop</p>
      <button className="win-button" style={{ width: "auto", padding: "4px 10px" }} onClick={onResetLayout}>
        Reset icon layout
      </button>
    </div>
  );
}
