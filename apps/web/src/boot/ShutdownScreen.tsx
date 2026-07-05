import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../shared/api";
import { setAuthUser } from "../auth/AuthState";

/**
 * Triggered by the terminal's `shutdown` command. Ends the session
 * server-side, clears local auth state, then returns to the landing page —
 * a real logout dressed as a power-off animation.
 */
export function ShutdownScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await logout().catch(() => undefined);
      if (cancelled) return;
      setAuthUser(null);
      setTimeout(() => {
        if (!cancelled) navigate("/", { replace: true });
      }, 1400);
    };

    void run();
    return () => {
      cancelled = true;
    };
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
      <p>Shutting down ONYX Engineering Workstation...</p>
    </div>
  );
}
