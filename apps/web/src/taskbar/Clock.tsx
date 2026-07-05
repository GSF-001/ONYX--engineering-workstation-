import { useEffect, useState } from "react";

export function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{ fontSize: 12, fontFamily: "var(--win-font-mono)", padding: "0 8px" }}>
      {now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}
