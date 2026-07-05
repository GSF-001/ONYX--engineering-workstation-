import type { Repository } from "./RepositoryTypes";

interface RepositoryHeaderProps {
  repository: Repository;
}

export function RepositoryHeader({ repository }: RepositoryHeaderProps) {
  return (
    <div style={{ padding: 12, borderBottom: "1px solid var(--win-face-dark)" }}>
      <p style={{ fontWeight: 700, fontSize: 15 }}>{repository.fullName}</p>
      <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 12, color: "var(--win-text-dim)" }}>
        <span>Default branch: {repository.defaultBranch ?? "main"}</span>
        <span>{repository.private ? "Private" : "Public"}</span>
      </div>
    </div>
  );
}
