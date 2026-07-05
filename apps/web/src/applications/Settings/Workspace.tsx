import { saveWindowLayout, loadWindowLayout, clearWindowLayout } from "../../window-manager";
import { useWindowManager } from "../../window-manager";
import type { useSettings } from "./SettingsHooks";

export function Workspace({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const manager = useWindowManager();

  return (
    <div style={{ padding: 16 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <input
          type="checkbox"
          checked={settings.autosave}
          onChange={(e) => settings.updateAutosave(e.target.checked)}
        />
        <span style={{ fontSize: 13 }}>Autosave window layout</span>
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          className="win-button"
          style={{ width: "auto", padding: "4px 10px" }}
          onClick={() => saveWindowLayout(manager.windows)}
        >
          Save current layout
        </button>
        <button
          className="win-button"
          style={{ width: "auto", padding: "4px 10px" }}
          onClick={() => {
            const layout = loadWindowLayout();
            if (!layout) return;
            // Re-opening each saved window at its saved bounds.
            for (const win of layout.windows) {
              manager.openMultiple(win.appId, win.title);
            }
          }}
        >
          Restore saved layout
        </button>
        <button
          className="win-button"
          style={{ width: "auto", padding: "4px 10px" }}
          onClick={clearWindowLayout}
        >
          Clear saved layout
        </button>
      </div>
    </div>
  );
}
