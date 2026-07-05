import { useState } from "react";
import { AppTitleBar } from "../../shared/components";
import type { useGroupsData } from "./GroupsHooks";
import { PublicGroups } from "./PublicGroups";
import { PrivateGroups } from "./PrivateGroups";
import { AnonymousGroups } from "./AnonymousGroups";
import { CreateGroup } from "./CreateGroup";
import { InviteMembers } from "./InviteMembers";
import { Dashboard } from "./Dashboard";
import { Chat } from "./Chat";
import { Files } from "./Files";
import { Activity } from "./Activity";
import { Announcements } from "./Announcements";
import { getActiveGroupId } from "./GroupsStore";
import { EmptyState, LoadingSpinner } from "../../shared/components";

type Category = "public" | "private" | "anonymous" | "create";
type GroupTab = "dashboard" | "chat" | "files" | "activity" | "announcements" | "invite";

export function GroupsWindow({ data }: { data: ReturnType<typeof useGroupsData> }) {
  const [category, setCategory] = useState<Category>("public");
  const [activeGroupId, setActiveGroupId] = useState<number | null>(getActiveGroupId());
  const [groupTab, setGroupTab] = useState<GroupTab>("dashboard");

  if (data.loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 48 }}><LoadingSpinner label="Loading groups..." /></div>;
  }
  if (data.error) return <EmptyState title="Couldn't load groups" description={data.error} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AppTitleBar appName="Groups" context="ONYX://CORE" />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div style={{ width: 150, borderRight: "1px solid var(--win-face-dark)", padding: 4 }}>
          {(["public", "private", "anonymous", "create"] as Category[]).map((c) => (
            <div
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: "6px 8px", fontSize: 12, cursor: "default", borderRadius: 2, textTransform: "capitalize",
                background: category === c ? "var(--win-titlebar-active)" : "transparent",
                color: category === c ? "var(--win-titlebar-text)" : "inherit",
              }}
            >
              {c === "create" ? "+ Create Group" : `${c} Groups`}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", minWidth: 0 }}>
          <div style={{ flex: 1, overflowY: "auto", borderRight: activeGroupId ? "1px solid var(--win-face-dark)" : "none" }}>
            {category === "public" && <PublicGroups groups={data.publicGroups} onSelect={setActiveGroupId} />}
            {category === "private" && <PrivateGroups groups={data.myGroups} onSelect={setActiveGroupId} />}
            {category === "anonymous" && <AnonymousGroups groups={data.anonymousGroups} onSelect={setActiveGroupId} />}
            {category === "create" && <CreateGroup onCreated={(g) => { setActiveGroupId(g.id); data.reload(); }} />}
          </div>

          {activeGroupId && (
            <div style={{ width: 320, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", borderBottom: "1px solid var(--win-face-dark)" }}>
                {(["dashboard", "chat", "files", "activity", "announcements", "invite"] as GroupTab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setGroupTab(t)}
                    className="win-button"
                    style={{ width: "auto", padding: "4px 8px", fontSize: 11, border: "none", borderBottom: groupTab === t ? "2px solid var(--win-accent)" : "2px solid transparent", background: "transparent" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {groupTab === "dashboard" && <Dashboard groupId={activeGroupId} />}
                {groupTab === "chat" && <Chat groupId={activeGroupId} />}
                {groupTab === "files" && <Files groupId={activeGroupId} />}
                {groupTab === "activity" && <Activity groupId={activeGroupId} />}
                {groupTab === "announcements" && <Announcements groupId={activeGroupId} />}
                {groupTab === "invite" && <InviteMembers groupId={activeGroupId} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
