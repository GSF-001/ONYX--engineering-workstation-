import { useState } from "react";
import type { useReportsData } from "./ReportsHooks";
import { Weekly } from "./Weekly";
import { Monthly } from "./Monthly";
import { Quarterly } from "./Quarterly";
import { ExportPDF } from "./ExportPDF";
import { Snapshot } from "./Snapshot";

type Tab = "weekly" | "monthly" | "quarterly" | "pdf" | "history";

const TABS: { id: Tab; label: string }[] = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "pdf", label: "PDF" },
  { id: "history", label: "History" },
];

export function ReportsWindow({ data }: { data: ReturnType<typeof useReportsData> }) {
  const [tab, setTab] = useState<Tab>("weekly");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--win-face-dark)" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="win-button"
            style={{
              width: "auto",
              padding: "6px 10px",
              border: "none",
              borderBottom: tab === t.id ? "2px solid var(--win-accent)" : "2px solid transparent",
              background: "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {data.error && <p style={{ color: "var(--win-danger)", fontSize: 12, padding: "6px 12px" }}>{data.error}</p>}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "weekly" && <Weekly onGenerate={(f) => void data.generate("weekly", f)} generating={data.generating} />}
        {tab === "monthly" && <Monthly onGenerate={(f) => void data.generate("monthly", f)} generating={data.generating} />}
        {tab === "quarterly" && <Quarterly onGenerate={(f) => void data.generate("quarterly", f)} generating={data.generating} />}
        {tab === "pdf" && <ExportPDF />}
        {tab === "history" && <Snapshot history={data.history} />}
      </div>
    </div>
  );
}
