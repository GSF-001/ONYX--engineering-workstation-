// Reports/Quarterly.tsx
import { PeriodPanel } from "./Weekly";
import type { ReportFormat } from "./ReportsTypes";

export function Quarterly({ onGenerate, generating }: { onGenerate: (f: ReportFormat) => void; generating: boolean }) {
  return (
    <PeriodPanel
      label="Quarterly snapshot"
      description="Current insights, labeled as a quarterly report. Same data as Weekly/Monthly for now."
      onGenerate={onGenerate}
      generating={generating}
    />
  );
}
