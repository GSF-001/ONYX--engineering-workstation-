import { useState } from "react";
import { Clock } from "./Clock";

/** Small popup calendar shown when the clock is clicked — read-only,
 * just for orientation ("what day is it"), not a scheduling tool. */
export function Calendar() {
  const [open, setOpen] = useState(false);
  const today = new Date();

  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => setOpen((o) => !o)} style={{ cursor: "default" }}>
        <Clock />
      </div>
      {open && (
        <div
          className="context-menu"
          style={{ position: "absolute", bottom: "100%", right: 0, padding: 10, width: 200 }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
            {today.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, fontSize: 10 }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <span key={d} style={{ textAlign: "center", opacity: 0.6 }}>
                {d}
              </span>
            ))}
            {Array.from({ length: startWeekday }).map((_, i) => <span key={`blank-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <span
                key={day}
                style={{
                  textAlign: "center",
                  padding: 2,
                  borderRadius: 2,
                  background: day === today.getDate() ? "var(--win-accent)" : "transparent",
                  color: day === today.getDate() ? "#06110d" : "inherit",
                }}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
