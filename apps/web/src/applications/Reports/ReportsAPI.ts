import { createReport, getReportDownloadUrl } from "../../shared/api";

/**
 * Honest limitation: the backend's /reports endpoint only generates
 * csv/json snapshots of *current* insights (see server exports.ts) — it
 * doesn't compute period-specific historical rollups. "Weekly/Monthly/
 * Quarterly" here are just labels on the same snapshot; picking a
 * different period does not change the underlying numbers yet.
 */
export const ReportsAPI = {
  create: createReport,
  downloadUrl: getReportDownloadUrl,
};
