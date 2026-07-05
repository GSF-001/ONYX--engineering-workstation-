import type { FeedPost } from "../CommunityTypes";
import { formatDateTime } from "../../../shared/utils";

export function EventCard({ event }: { event: FeedPost }) {
  return (
    <div className="win-frame" style={{ padding: 10, marginBottom: 8 }}>
      <p style={{ fontWeight: 700, fontSize: 13 }}>{event.title}</p>
      <p style={{ fontSize: 12, color: "var(--win-text-dim)" }}>{event.body}</p>
      {event.eventAt && (
        <p style={{ fontSize: 11, color: "var(--win-accent)", marginTop: 4 }}>{formatDateTime(event.eventAt)}</p>
      )}
    </div>
  );
}
