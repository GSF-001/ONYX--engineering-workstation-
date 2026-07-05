import { useHeatmapData } from "./HeatmapHooks";
import { HeatmapWindow } from "./HeatmapWindow";
import "./HeatmapStyles.css";

export default function HeatmapApp() {
  const data = useHeatmapData();
  return <HeatmapWindow data={data} />;
}
