interface SystemStatusProps {
  eventsProcessed: number;
  status: "operational" | "degraded" | "down";
}

/** The little "SYSTEM STATUS" panel from the desktop mockup — operational
 * state plus a running event counter. */
export function SystemStatus({ eventsProcessed, status }: SystemStatusProps) {
  const statusColor =
    status === "operational" ? "var(--win-success)" : status === "degraded" ? "var(--win-warning)" : "var(--win-danger)";

  return (
    <div className="win-frame" style={{ padding: 12, width: 220 }}>
      <p style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>SYSTEM STATUS</p>
      <p style={{ fontSize: 12, marginBottom: 4 }}>
        STATUS:{" "}
        <span style={{ color: statusColor, fontWeight: 700 }}>{status.toUpperCase()}</span>
      </p>
      <p style={{ fontSize: 12, marginBottom: 8 }}>
        DATA STREAM: <span style={{ color: "var(--win-success)", fontWeight: 700 }}>LIVE</span>
      </p>
      <p style={{ fontSize: 11, color: "var(--win-text-dim)" }}>EVENTS PROCESSED</p>
      <p style={{ fontSize: 22, fontFamily: "var(--win-font-mono)", fontWeight: 700 }}>
        {eventsProcessed.toLocaleString()}
      </p>
    </div>
  );
}
