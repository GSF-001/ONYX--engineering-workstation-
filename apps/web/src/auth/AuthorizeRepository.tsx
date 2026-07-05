import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RepositoryPicker } from "./RepositoryPicker";
import type { Repository } from "../shared/types";

interface AuthorizeRepositoryProps {
  teamId: number;
}

/**
 * Onboarding step shown right after first sign-in: connect at least one
 * repository before entering the desktop. Not wired into the router yet —
 * intended to be used as the /boot page's first-run branch once that page
 * exists.
 */
export function AuthorizeRepository({ teamId }: AuthorizeRepositoryProps) {
  const navigate = useNavigate();
  const [connected, setConnected] = useState<Repository[]>([]);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 32 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Authorize a repository</h1>
      <p style={{ fontSize: 13, color: "var(--color-text-dim)", marginBottom: 20 }}>
        Connect a GitHub repository to start seeing review health, reviewer
        load, and activity — you can add more later from Settings.
      </p>

      <RepositoryPicker teamId={teamId} onConnected={(repo) => setConnected((prev) => [...prev, repo])} />

      {connected.length > 0 && (
        <ul style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 4 }}>
          {connected.map((repo) => (
            <li key={repo.id} style={{ fontSize: 13, color: "var(--color-good)" }}>
              ✓ {repo.fullName} connected
            </li>
          ))}
        </ul>
      )}

      <button
        disabled={connected.length === 0}
        onClick={() => navigate("/boot")}
        style={{ marginTop: 24 }}
      >
        Continue
      </button>
    </div>
  );
}
