import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadAuthUser } from "./AuthState";
import { LoadingSpinner } from "../shared/components";

/**
 * Safety-net page for anyone who lands on /auth/callback directly. In the
 * normal flow the server sets the session cookie and redirects straight to
 * /desktop, so this page usually isn't hit — but if it is, it polls for the
 * session and forwards once it's confirmed.
 */
export function OAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let attempts = 0;
    let cancelled = false;

    const poll = async () => {
      const user = await loadAuthUser();
      if (cancelled) return;

      if (user) {
        navigate("/boot", { replace: true });
        return;
      }

      attempts += 1;
      if (attempts >= 5) {
        setError("Couldn't confirm your GitHub sign-in. Please try connecting again.");
        return;
      }
      setTimeout(poll, 600);
    };

    void poll();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 12,
      }}
    >
      {error ? (
        <>
          <p style={{ color: "var(--color-danger)" }}>{error}</p>
          <button onClick={() => navigate("/")}>Back to landing</button>
        </>
      ) : (
        <LoadingSpinner label="Confirming your session..." />
      )}
    </div>
  );
}
