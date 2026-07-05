import { useState } from "react";
import { GroupsAPI } from "./GroupsAPI";
import type { GroupSummary } from "./GroupsTypes";

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function CreateGroup({ onCreated }: { onCreated: (group: GroupSummary) => void }) {
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private" | "anonymous">("public");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const group = await GroupsAPI.create({
        name: name.trim(),
        slug: slugify(name),
        visibility,
        description: undefined,
      });
      onCreated(group);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Group name" style={{ padding: 8, fontSize: 13 }} />
      <select value={visibility} onChange={(e) => setVisibility(e.target.value as any)} style={{ padding: 8, fontSize: 13 }}>
        <option value="public">Public</option>
        <option value="private">Private</option>
        <option value="anonymous">Anonymous</option>
      </select>
      {error && <p style={{ color: "var(--win-danger)", fontSize: 12 }}>{error}</p>}
      <button type="submit" disabled={submitting} className="win-button" style={{ width: "auto", padding: "6px 14px" }}>
        {submitting ? "Creating..." : "Create Group"}
      </button>
    </form>
  );
}
