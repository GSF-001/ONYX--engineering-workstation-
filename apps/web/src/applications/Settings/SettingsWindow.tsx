import { useState } from "react";
import type { useSettings } from "./SettingsHooks";
import { Appearance } from "./Appearance";
import { Sounds } from "./Sounds";
import { Workspace } from "./Workspace";
import { Keyboard } from "./Keyboard";
import { About } from "./About";

type Tab = "appearance" | "sounds" | "workspace" | "keyboard" | "about";

const TABS: { id: Tab; label: string }[] = [
  { id: "appearance", label: "Appearance" },
  { id: "sounds", label: "Sounds" },
  { id: "workspace", label: "Workspace" },
  { id: "keyboard", label: "Keyboard" },
  { id: "about", label: "About" },
];

export function SettingsWindow({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const [tab, setTab] = useState<Tab>("appearance");

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: 130, borderRight: "1px solid var(--win-face-dark)", padding: 4 }}>
        {TABS.map((t) => (
          <div
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "6px 8px",
              fontSize: 12,
              cursor: "default",
              borderRadius: 2,
              background: tab === t.id ? "var(--win-titlebar-active)" : "transparent",
              color: tab === t.id ? "var(--win-titlebar-text)" : "inherit",
            }}
          >
            {t.label}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "appearance" && <Appearance settings={settings} />}
        {tab === "sounds" && <Sounds settings={settings} />}
        {tab === "workspace" && <Workspace settings={settings} />}
        {tab === "keyboard" && <Keyboard />}
        {tab === "about" && <About />}
      </div>
    </div>
  );
}
