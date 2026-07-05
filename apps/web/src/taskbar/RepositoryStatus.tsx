interface RepositoryStatusProps {
  fullName: string;
  lastSyncedAt: string | null;
}

export function RepositoryStatus({ fullName, lastSyncedAt }: RepositoryStatusProps) {
  const syncedLabel = lastSyncedAt
    ? `synced ${Math.round((Date.now() - new Date(lastSyncedAt).getTime()) / 60000)}m ago`
    : "not synced yet";

  return (
    <span style={{ fontSize: 11, color: "var(--win-text-dim)" }} title={fullName}>
      {fullName} · {syncedLabel}
    </span>
  );
}
