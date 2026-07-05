import { useEffect, useState } from "react";
import { UsageBar } from "./CpuUsage";

/** Same caveat as CpuUsage: simulated, not a real memory reading. */
export function MemoryUsage() {
  const [value, setValue] = useState(40);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => Math.max(15, Math.min(90, prev + (Math.random() * 10 - 5))));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return <UsageBar label="MEM" value={value} />;
}
