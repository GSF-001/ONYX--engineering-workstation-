import type { DashboardResponse } from "./DashboardTypes";

interface DashboardSidebarProps {
  repositories: DashboardResponse["repositories"];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function DashboardSidebar({ repositories, selectedId, onSelect }: DashboardSidebarProps) {
  return (
    <div
      style={{
        width: 150,
        borderRight: "1px solid var(--win-face-dark)",
        padding: 6,
        overflowY: "auto",
      }}
    >
      <p style={{ fontSize: 11, color: "var(--win-text-dim)", padding: "4px 6px" }}>REPOSITORIES</p>
      {repositories.map((repo) => (
        <div
          key={repo.id}
          onClick={() => onSelect(repo.id)}
          style={{
            padding: "6px 8px",
            fontSize: 12,
            borderRadius: 2,
            cursor: "default",
            background: repo.id === selectedId ? "var(--win-titlebar-active)" : "transparent",
            color: repo.id === selectedId ? "var(--win-titlebar-text)" : "inherit",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={repo.fullName}
        >
          {repo.fullName.split("/")[1] ?? repo.fullName}
        </div>
      ))}
      {repositories.length === 0 && (
        <p style={{ fontSize: 11, color: "var(--win-text-dim)", padding: 8 }}>
          No repositories connected yet.
        </p>
      )}
    </div>
  );
}
