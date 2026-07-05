import { useState } from "react";
import { useSocketEvent } from "../../shared/hooks";
import { EmptyState } from "../../shared/components";
import { formatRelativeTime } from "../../shared/utils";

interface LiveEntry {
  id: string;
  text: string;
  at: string;
}

let counter = 0;

/**
 * Real-time strip fed directly from websocket events, independent of the
 * fetched `history` — shows things as they happen without waiting for a
 * refetch, capped at the 20 most recent.
 */
export function LiveFeed() {
  const [entries, setEntries] = useState<LiveEntry[]>([]);

  const push = (text: string) => {
    counter += 1;
    setEntries((prev) => [{ id: `live-${counter}`, text, at: new Date().toISOString() }, ...prev].slice(0, 20));
  };

  useSocketEvent<{ number: number; action?: string }>("pull_request.updated", (msg) =>
    push(`PR #${msg.number} ${msg.action ?? "updated"}`)
  );
  useSocketEvent<{ pullRequestNumber: number; reviewer: string; state: string }>("review.created", (msg) =>
    push(`${msg.reviewer} ${msg.state.replace(/_/g, " ")} on PR #${msg.pullRequestNumber}`)
  );
  useSocketEvent<{ name: string; status: string; conclusion: string | null }>("check_run.updated", (msg) => {
    if (msg.status === "completed") push(`${msg.name} ${msg.conclusion === "failure" ? "failed" : "passed"}`);
  });

  if (entries.length === 0) {
    return <EmptyState title="Watching for live events" description="Anything that happens on this repo will show up here instantly." />;
  }

  return (
    <div style={{ padding: 10 }}>
      {entries.map((entry) => (
        <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0" }}>
          <span>{entry.text}</span>
          <span style={{ color: "var(--win-text-dim)" }}>{formatRelativeTime(entry.at)}</span>
        </div>
      ))}
    </div>
  );
}
