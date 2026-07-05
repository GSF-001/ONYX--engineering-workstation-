import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Triggered by the terminal's `restart` command. Unlike shutdown, this
 * keeps the session alive and just replays the boot sequence.
 */
export function RestartScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => navigate("/boot", { replace: true }), 1200);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "monospace",
        fontSize: 14,
      }}
    >
      <p>Restarting...</p>
    </div>
  );
}
