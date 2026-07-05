import { formatRelativeTime } from "../../../shared/utils";

const TYPE_LABEL: Record<string, string> = {
  member_joined: "joined the group",
  member_left: "left the group",
  announcement_posted: "posted an announcement",
  file_uploaded: "uploaded a file",
};

export function ActivityItem({ event }: { event: { type: string; actorLogin: string | null; createdAt: string } }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: "1px solid var(--win-face-dark)" }}>
      <span>{event.actorLogin ?? "someone"} {TYPE_LABEL[event.type] ?? event.type}</span>
      <span style={{ color: "var(--win-text-dim)" }}>{formatRelativeTime(event.createdAt)}</span>
    </div>
  );
}
