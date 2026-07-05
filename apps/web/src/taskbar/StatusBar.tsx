import { LiveIndicator } from "./LiveIndicator";
import { NetworkStatus } from "./NetworkStatus";
import { CpuUsage } from "./CpuUsage";
import { MemoryUsage } from "./MemoryUsage";

interface StatusBarProps {
  eventsProcessed: number;
  repositoryFullName?: string;
}

/** The thin informational strip under the desktop icons in the mockup:
 * READY / SYNCED / LATENCY / WATCHING / GITHUB CONNECTED / event count. */
export function StatusBar({ eventsProcessed, repositoryFullName }: StatusBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        height: 22,
        padding: "0 10px",
        fontSize: 11,
        color: "var(--win-text-dim)",
        background: "var(--win-face)",
        borderTop: "1px solid var(--win-face-dark)",
      }}
    >
      <span>READY</span>
      <LiveIndicator />
      <NetworkStatus />
      {repositoryFullName && <span>WATCHING {repositoryFullName}</span>}
      <span>{eventsProcessed.toLocaleString()} EVENTS</span>
      <div style={{ flex: 1 }} />
      <CpuUsage />
      <MemoryUsage />
    </div>
  );
}
