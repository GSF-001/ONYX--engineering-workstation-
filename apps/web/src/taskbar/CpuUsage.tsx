import { useEffect, useState } from "react";

/**
 * Browsers have no API to read real CPU usage, so this is a cosmetic
 * simulated reading — matches the mockup's retro system-monitor chrome
 * without pretending to measure anything real.
 */
export function CpuUsage() {
  const [value, setValue] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => Math.max(5, Math.min(95, prev + (Math.random() * 16 - 8))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return <UsageBar label="CPU" value={value} />;
}

export function UsageBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
      <span style={{ color: "var(--win-text-dim)" }}>{label}</span>
      <div style={{ width: 60, height: 8, background: "var(--win-face-dark)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: value > 80 ? "var(--win-danger)" : "var(--win-accent)",
          }}
        />
      </div>
      <span style={{ fontFamily: "var(--win-font-mono)", width: 28 }}>{Math.round(value)}%</span>
    </div>
  );
}
