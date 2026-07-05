import { ConnectGitHubButton } from "./ConnectGitHubButton";

interface Tier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Solo",
    price: "Free",
    description: "For a single maintainer keeping an eye on one repo.",
    features: ["1 repository", "7-day activity history", "Dashboard, Insights, Terminal"],
  },
  {
    name: "Team",
    price: "$12 / seat / mo",
    description: "For teams that want live review health across every repo.",
    features: [
      "Unlimited repositories",
      "Full history + exports",
      "All apps, all themes",
      "Reviewer load & reciprocity gap",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Talk to us",
    description: "For orgs that need SSO, audit logs, and custom retention.",
    features: ["SSO / SAML", "Audit log export", "Dedicated support"],
  },
];

export function PricingSection() {
  return (
    <section style={{ padding: "40px 0" }}>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 13,
          letterSpacing: "0.08em",
          color: "var(--color-text-dim)",
          marginBottom: 20,
        }}
      >
        PRICING
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            style={{
              border: tier.highlighted
                ? "1px solid var(--color-accent)"
                : "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background: "var(--color-bg-raised)",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{tier.name}</h3>
            <p style={{ fontSize: 22, fontFamily: "var(--font-display)", fontWeight: 700 }}>
              {tier.price}
            </p>
            <p style={{ fontSize: 13, color: "var(--color-text-dim)" }}>{tier.description}</p>
            <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {tier.features.map((f) => (
                <li key={f} style={{ fontSize: 13, color: "var(--color-text-dim)" }}>
                  · {f}
                </li>
              ))}
            </ul>
            {tier.name !== "Enterprise" && (
              <div style={{ marginTop: 8 }}>
                <ConnectGitHubButton label={tier.name === "Solo" ? "Start free" : "Start trial"} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
