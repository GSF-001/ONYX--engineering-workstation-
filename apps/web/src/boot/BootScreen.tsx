import { useNavigate } from "react-router-dom";
import { BootLogo } from "./BootLogo";
import { BootLoader } from "./BootLoader";
import { BootProgress } from "./BootProgress";
import { useBootState } from "./BootState";
import { BOOT_READY_MESSAGE, BOOT_WELCOME_MESSAGE } from "./BootSequence";
import { TOKENS } from "../theme";

/**
 * Full-screen boot sequence shown once per session before the desktop
 * loads. On completion, forwards to /desktop after a short pause so the
 * "SYSTEM READY" message is actually readable.
 */
export function BootScreen() {
  const navigate = useNavigate();
  const { steps, isComplete } = useBootState(() => {
    setTimeout(() => navigate("/desktop", { replace: true }), 900);
  });

  return (
    <div
      style={{
        height: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: TOKENS.zIndex.boot,
      }}
    >
      <div
        className="win-frame"
        style={{ width: 460, padding: 20, display: "flex", gap: 16 }}
      >
        <div style={{ flex: 1 }}>
          <BootLogo />
          <div style={{ marginTop: 16 }}>
            <BootProgress steps={steps} />
          </div>
          {isComplete && (
            <div style={{ marginTop: 16, fontFamily: "var(--win-font-mono)" }}>
              <p style={{ color: "var(--win-success)", fontWeight: 700 }}>{BOOT_READY_MESSAGE}</p>
              <p style={{ color: "var(--win-text)" }}>{BOOT_WELCOME_MESSAGE}</p>
            </div>
          )}
        </div>
        <BootLoader />
      </div>
    </div>
  );
}
