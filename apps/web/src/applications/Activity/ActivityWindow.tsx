import { useState } from "react";
import type { useActivityData } from "./ActivityHooks";
import type { EventTypeFilter } from "./ActivityTypes";
import { Filters } from "./Filters";
import { LiveFeed } from "./LiveFeed";
import { Timeline } from "./Timeline";
import { Events } from "./Events";
import { EmptyState, LoadingSpinner } from "../../shared/components";

type View = "timeline" | "events" | "live";

export function ActivityWindow({ data }: { data: ReturnType<typeof useActivityData> }) {
  const [view, setView] = useState<View>("timeline");
  const [filter, setFilter] = useState<EventTypeFilter>("all");

  if (data.loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <LoadingSpinner label="Loading activity..." />
      </div>
    );
  }
  if (data.error) return <EmptyState title="Couldn't load activity" description={data.error} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--win-face-dark)" }}>
        {(["timeline", "events", "live"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="win-button"
            style={{
              width: "auto",
              padding: "6px 10px",
              border: "none",
              borderBottom: view === v ? "2px solid var(--win-accent)" : "2px solid transparent",
              background: "transparent",
              textTransform: "capitalize",
            }}
          >
            {v}
          </button>
        ))}
      </div>
      {view !== "live" && <Filters value={filter} onChange={setFilter} />}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {view === "timeline" && <Timeline history={data.history} filter={filter} />}
        {view === "events" && <Events history={data.history} filter={filter} />}
        {view === "live" && <LiveFeed />}
      </div>
    </div>
  );
}
