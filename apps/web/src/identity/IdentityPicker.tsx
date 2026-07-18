import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IdentityAPI } from "./IdentityAPI";
import { IdentityPreview } from "./IdentityPreview";
import { GenerateIdentityButton } from "./GenerateIdentityButton";
import { ConfirmIdentity } from "./ConfirmIdentity";
import { setCachedHandle } from "./IdentityStore";
import { LoadingSpinner } from "../shared/components";

export function IdentityPicker() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCandidates = useCallback(async () => {
    setLoadingCandidates(true);
    setError(null);
    try {
      const list = await IdentityAPI.getCandidates();
      setCandidates(list);
      setSelected(list[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate identities.");
    } finally {
      setLoadingCandidates(false);
    }
  }, []);

  useEffect(() => {
    void loadCandidates();
  }, [loadCandidates]);

  const handleConfirm = async () => {
    if (!selected) return;
    setConfirming(true);
    setError(null);
    try {
      const result = await IdentityAPI.confirm(selected);
      setCachedHandle(result.handle);
      navigate("/boot", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm identity.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0e11",
      }}
    >
      <div className="win-frame" style={{ width: 560, padding: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Choose Your ONYX Identity</h1>
        <p style={{ fontSize: 12, color: "var(--win-text-dim)", marginBottom: 20 }}>
          Pick a handle. This name is used publicly across ONYX instead of your real identity.
        </p>

        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ flex: 1 }}>
            {loadingCandidates ? (
              <LoadingSpinner label="Generating identities..." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {candidates.map((handle) => (
                  <div
                    key={handle}
                    onClick={() => setSelected(handle)}
                    style={{
                      padding: "8px 12px",
                      fontFamily: "var(--win-font-mono)",
                      fontSize: 13,
                      cursor: "default",
                      borderRadius: 2,
                      background: selected === handle ? "var(--win-titlebar-active)" : "transparent",
                      color: selected === handle ? "var(--win-titlebar-text)" : "inherit",
                    }}
                  >
                    {handle}
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              <GenerateIdentityButton onGenerate={loadCandidates} loading={loadingCandidates} />
            </div>
          </div>

          <div style={{ width: 180, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            {selected && <IdentityPreview handle={selected} />}
            <ConfirmIdentity disabled={!selected} loading={confirming} onConfirm={handleConfirm} />
          </div>
        </div>

        {error && <p style={{ color: "var(--win-danger)", fontSize: 12, marginTop: 12 }}>{error}</p>}

        <p style={{ fontSize: 10, color: "var(--win-text-faint)", marginTop: 16 }}>
          * Identity can be changed once every 30 days.
        </p>
      </div>
    </div>
  );
}
