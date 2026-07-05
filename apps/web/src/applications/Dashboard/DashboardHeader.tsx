import type { Repository } from "./DashboardTypes";
import { formatRelativeTime } from "../../shared/utils";

interface DashboardHeaderProps {
  repository: Repository | undefined;
  onSync: () => void;
  syncing: boolean;
}

export function DashboardHeader({ repository, onSync, syncing }: DashboardHeaderProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px" }}>
      <div>
        <p style={{ fontWeight: 700, fontSize: 13 }}>{repository?.fullName ?? "No repository selected"}</p>
        {repository?.lastSyncedAt && (
          <p style={{ fontSize: 11, color: "var(--win-text-dim)" }}>
            Last sync {formatRelativeTime(repository.lastSyncedAt)}
          </p>
        )}
      </div>
      <button onClick={onSync} disabled={syncing || !repository} className="win-button" style={{ width: "auto", padding: "0 10px" }}>
        {syncing ? "Syncing..." : "Sync now"}
      </button>
    </div>
  );
}
