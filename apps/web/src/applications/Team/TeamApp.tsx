import { useTeamData } from "./TeamHooks";
import { TeamWindow } from "./TeamWindow";
import "./TeamStyles.css";

export default function TeamApp() {
  const data = useTeamData();
  return <TeamWindow data={data} />;
}
