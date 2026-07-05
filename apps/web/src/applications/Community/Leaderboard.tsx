// Community/Leaderboard.tsx
import { CommunityAPI } from "./CommunityAPI";
import { useCommunityList } from "./CommunityHooks";
import { IdentityAvatar, EmptyState, LoadingSpinner } from "../../shared/components";

export function Leaderboard() {
  const { items, loading, error } = useCommunityList(CommunityAPI.getLeaderboard);
  if (loading) return <LoadingSpinner label="Loading leaderboard..." />;
  if (error) return <EmptyState title="Couldn't load leaderboard" description={error} />;
  if (items.length === 0) return <EmptyState title="No ranked developers yet" />;

  return (
    <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", padding: 12 }}>
      <thead>
        <tr style={{ textAlign: "left", color: "var(--win-text-dim)" }}>
          <th style={{ padding: 6 }}>#</th>
          <th style={{ padding: 6 }}></th>
          <th style={{ padding: 6 }}>Developer</th>
          <th style={{ padding: 6 }}>Score</th>
        </tr>
      </thead>
      <tbody>
        {items.map((entry) => (
          <tr key={entry.rank} style={{ borderTop: "1px solid var(--win-face-dark)" }}>
            <td style={{ padding: 6 }}>{entry.rank}</td>
            <td style={{ padding: 6 }}><IdentityAvatar handle={entry.login} size={20} /></td>
            <td style={{ padding: 6 }}>{entry.login}</td>
            <td style={{ padding: 6, fontFamily: "var(--win-font-mono)" }}>{entry.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
