import type { RepositoryInsights } from "../../shared/api/endpoints";
import { EmptyState } from "../../shared/components";

/** Raw per-person commit counts — deliberately un-normalized (unlike
 * BusFactor's percentage framing) for when absolute volume matters more
 * than relative share. */
export function Contribution({ contributions }: { contributions: RepositoryInsights["busFactor"]["contributions"] }) {
  if (contributions.length === 0) return <EmptyState title="No contributions yet" />;

  const max = Math.max(...contributions.map((c) => c.commitCount));

  return (
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
      {contributions.map((c) => (
        <div key={c.authorLogin} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 90, fontSize: 12 }}>{c.authorLogin}</span>
          <div style={{ flex: 1, height: 14, background: "var(--win-face-dark)" }}>
            <div
              style={{ width: `${(c.commitCount / max) * 100}%`, height: "100%", background: "var(--win-success)" }}
            />
          </div>
          <span style={{ fontSize: 11, width: 40, textAlign: "right" }}>{c.commitCount}</span>
        </div>
      ))}
    </div>
  );
}
