import type { EventTypeFilter } from "./ActivityTypes";

const OPTIONS: { id: EventTypeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "opened", label: "Opened" },
  { id: "reviewed", label: "Reviewed" },
  { id: "merged", label: "Merged" },
  { id: "closed", label: "Closed" },
];

interface FiltersProps {
  value: EventTypeFilter;
  onChange: (value: EventTypeFilter) => void;
}

export function Filters({ value, onChange }: FiltersProps) {
  return (
    <div style={{ display: "flex", gap: 4, padding: "6px 10px", borderBottom: "1px solid var(--win-face-dark)" }}>
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className="win-button"
          style={{
            width: "auto",
            padding: "3px 10px",
            background: value === opt.id ? "var(--win-titlebar-active)" : "var(--win-face)",
            color: value === opt.id ? "var(--win-titlebar-text)" : "var(--win-text)",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
