import type { RepositoryInsights } from "../../shared/api/endpoints";
import { EmptyState } from "../../shared/components";
import { formatPercent } from "../../shared/utils";

/** Team-context bus-factor view: same underlying numbers as
 * Insights/BusFactor.tsx but framed as "workload concentration" rather
 * than a risk score, since Team is about people, not repo health. */
export function BusFactor({ contributions }: { contributions: RepositoryInsights["busFactor"]["contributions"] }) {
  if (contributions.length === 0) {
    return <EmptyState title="No commit data yet" />;
  }

  const top = contributions[0];

  return (
    <div style={{ padding: 12 }}>
      <p style={{ fontSize: 12, color: "var(--win-text-dim)", marginBottom: 8 }}>
        {top.authorLogin} accounts for {formatPercent(top.share)} of recent commits.
      </p>
      {contributions.map((c) => (
        <div key={c.authorLogin} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ width: 90, fontSize: 12 }}>{c.authorLogin}</span>
          <div style={{ flex: 1, height: 6, background: "var(--win-face-dark)" }}>
            <div style={{ width: `${c.share * 100}%`, height: "100%", background: "var(--win-accent)" }} />
          </div>
          <span style={{ fontSize: 11, width: 36, textAlign: "right" }}>{formatPercent(c.share)}</span>
        </div>
      ))}
    </div>
  );
}
