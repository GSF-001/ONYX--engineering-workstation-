import { useState } from "react";
import { listWorkspaces, deleteWorkspace } from "./WorkspaceManager";
import { saveWorkspace } from "./SaveWorkspace";
import { useWindowManager } from "../window-manager";
import { formatDateTime } from "../shared/utils";

interface WorkspaceProps {
  onLoad: (name: string) => void;
}

/** UI for naming/saving the current window layout and picking a previously
 * saved one — surfaced from the desktop context menu ("Save Workspace...")
 * and from Settings/Workspace.tsx's "manage workspaces" entry point. */
export function Workspace({ onLoad }: WorkspaceProps) {
  const manager = useWindowManager();
  const [name, setName] = useState("");
  const [workspaces, setWorkspaces] = useState(listWorkspaces());

  const handleSave = () => {
    if (!name.trim()) return;
    saveWorkspace(name.trim(), manager.windows);
    setWorkspaces(listWorkspaces());
    setName("");
  };

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 8 }}>SAVE CURRENT LAYOUT</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace name..."
          style={{ flex: 1, padding: 6, fontSize: 12 }}
        />
        <button className="win-button" style={{ width: "auto", padding: "0 10px" }} onClick={handleSave}>
          Save
        </button>
      </div>

      <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 8 }}>SAVED WORKSPACES</p>
      {workspaces.length === 0 && (
        <p style={{ fontSize: 12, color: "var(--win-text-dim)" }}>No workspaces saved yet.</p>
      )}
      {workspaces.map((w) => (
        <div key={w.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--win-face-dark)" }}>
          <div>
            <p style={{ fontSize: 13 }}>{w.name}</p>
            <p style={{ fontSize: 10, color: "var(--win-text-dim)" }}>{formatDateTime(w.savedAt)} · {w.windows.length} windows</p>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="win-button" style={{ width: "auto", padding: "0 8px" }} onClick={() => onLoad(w.name)}>
              Load
            </button>
            <button
              className="win-button"
              style={{ width: "auto", padding: "0 8px" }}
              onClick={() => {
                deleteWorkspace(w.name);
                setWorkspaces(listWorkspaces());
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
