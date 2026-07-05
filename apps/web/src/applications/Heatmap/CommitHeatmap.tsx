import { WeekendHeatmapWidget } from "../../shared/components";
import type { WeekendHeatmapResult } from "./HeatmapTypes";

/** The one heatmap with real backing data — commits table, day/hour grid. */
export function CommitHeatmap({ data }: { data: WeekendHeatmapResult }) {
  return <WeekendHeatmapWidget data={data} />;
}
