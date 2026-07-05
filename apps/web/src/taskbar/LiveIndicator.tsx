import { useWebSocket } from "../shared/hooks";

export function LiveIndicator() {
  const { isConnected } = useWebSocket();

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontFamily: "var(--win-font-mono)",
        color: isConnected ? "var(--win-success)" : "var(--win-text-dim)",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: isConnected ? "var(--win-success)" : "var(--win-text-dim)",
        }}
      />
      {isConnected ? "LIVE SYNC" : "OFFLINE"}
    </span>
  );
}
