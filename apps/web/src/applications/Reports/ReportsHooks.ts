import { useCallback, useState } from "react";
import { ReportsAPI } from "./ReportsAPI";
import { addReportToHistory, getReportHistory } from "./ReportsStore";
import type { ReportFormat, ReportPeriod, ReportsViewState } from "./ReportsTypes";
import { getActiveRepositoryId } from "../Dashboard/DashboardStore";

export function useReportsData() {
  const [state, setState] = useState<ReportsViewState>({
    history: getReportHistory(),
    generating: false,
    error: null,
  });

  const generate = useCallback(async (period: ReportPeriod, format: ReportFormat) => {
    const repositoryId = getActiveRepositoryId();
    if (!repositoryId) {
      setState((prev) => ({ ...prev, error: "No repository selected." }));
      return;
    }

    setState((prev) => ({ ...prev, generating: true, error: null }));
    try {
      const job = await ReportsAPI.create(repositoryId, format);
      const record = { ...job, repositoryId, format, period, createdAt: new Date().toISOString() };
      addReportToHistory(record);
      setState({ history: getReportHistory(), generating: false, error: null });
      return record;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        generating: false,
        error: err instanceof Error ? err.message : "Failed to generate report.",
      }));
      return null;
    }
  }, []);

  return { ...state, generate };
}
