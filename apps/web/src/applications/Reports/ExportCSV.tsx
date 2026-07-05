import { ReportsAPI } from "./ReportsAPI";
import type { ReportJobRecord } from "./ReportsTypes";

export function ExportCSV({ record }: { record: ReportJobRecord }) {
  if (record.format !== "csv") return null;
  return (
    <a
      href={ReportsAPI.downloadUrl(record.filePath)}
      target="_blank"
      rel="noreferrer"
      style={{ fontSize: 12, color: "var(--win-accent)" }}
    >
      Download CSV
    </a>
  );
}
