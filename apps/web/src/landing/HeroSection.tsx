import { ConnectGitHubButton } from "./ConnectGitHubButton";

export function HeroSection() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "56px 0 32px",
        maxWidth: 640,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 12,
          letterSpacing: "0.1em",
          color: "var(--color-accent)",
        }}
      >
        RETRO LOOK. MODERN POWER. ZERO NOISE.
      </p>
      <h1 style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15 }}>
        Observe. Review. Ship Faster.
      </h1>
      <p style={{ fontSize: 15, color: "var(--color-text-dim)", lineHeight: 1.6 }}>
        ONYX turns your GitHub repositories into a workstation you boot into —
        live review health, reviewer load, and risk signals, all in windows
        you control.
      </p>
      <div>
        <ConnectGitHubButton size="lg" />
      </div>
    </section>
  );
}
