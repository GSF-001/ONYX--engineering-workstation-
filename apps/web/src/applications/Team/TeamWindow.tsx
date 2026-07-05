import { useState } from "react";
import type { useTeamData } from "./TeamHooks";
import { TeamStats } from "./TeamStats";
import { Members } from "./Members";
import { Leaderboard } from "./Leaderboard";
import { ReviewerLoad } from "./ReviewerLoad";
import { BusFactor } from "./BusFactor";
import { Contribution } from "./Contribution";
import { EmptyState, LoadingSpinner } from "../../shared/components";

type Tab = "leaderboard" | "members" | "load" | "busFactor" | "contribution";

const TABS: { id: Tab; label: string }[] = [
  { id: "leaderboard", label: "Leaderboard" },
  { id: "members", label: "Members" },
  { id: "load", label: "Reviewer Load" },
  { id: "busFactor", label: "Bus Factor" },
  { id: "contribution", label: "Contribution" },
];

export function TeamWindow({ data }: { data: ReturnType<typeof useTeamData> }) {
  const [tab, setTab] = useState<Tab>("leaderboard");

  if (data.loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <LoadingSpinner label="Loading team..." />
      </div>
    );
  }
  if (data.error) return <EmptyState title="Couldn't load team" description={data.error} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TeamStats members={data.members} reviewerLoad={data.reviewerLoad} />
      <div style={{ display: "flex", borderBottom: "1px solid var(--win-face-dark)" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="win-button"
            style={{
              width: "auto",
              padding: "6px 10px",
              border: "none",
              borderBottom: tab === t.id ? "2px solid var(--win-accent)" : "2px solid transparent",
              background: "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "leaderboard" && <Leaderboard reviewerLoad={data.reviewerLoad} contributions={data.contributions} />}
        {tab === "members" && <Members members={data.members} />}
        {tab === "load" && <ReviewerLoad entries={data.reviewerLoad} />}
        {tab === "busFactor" && <BusFactor contributions={data.contributions} />}
        {tab === "contribution" && <Contribution contributions={data.contributions} />}
      </div>
    </div>
  );
}
