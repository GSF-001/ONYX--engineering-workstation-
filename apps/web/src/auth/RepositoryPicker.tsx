import { useState } from "react";
import { createRepository } from "../shared/api";
import type { Repository } from "../shared/types";

interface RepositoryPickerProps {
  teamId: number;
  onConnected: (repo: Repository) => void;
}

/**
 * Connects a new GitHub repository by owner/name. There's no "browse your
 * GitHub org" endpoint yet (that would need its own backend route listing
 * repos the access token can see) — for now this takes the exact
 * `owner/name` the person types, which is what createRepository expects.
 */
export function RepositoryPicker({ teamId, onConnected }: RepositoryPickerProps) {
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner.trim() || !name.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const repo = await createRepository({ teamId, owner: owner.trim(), name: name.trim() });
      onConnected(repo);
      setOwner("");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't connect that repository.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="owner (e.g. octocat)"
          style={{ flex: 1, padding: 8, fontSize: 13 }}
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="repository (e.g. hello-world)"
          style={{ flex: 1, padding: 8, fontSize: 13 }}
        />
      </div>
      {error && <p style={{ color: "var(--color-danger)", fontSize: 13 }}>{error}</p>}
      <button type="submit" disabled={submitting} style={{ alignSelf: "flex-start" }}>
        {submitting ? "Connecting..." : "Connect repository"}
      </button>
    </form>
  );
}
