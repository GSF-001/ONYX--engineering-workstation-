import { useSettings } from "./SettingsHooks";
import { SettingsWindow } from "./SettingsWindow";
import "./SettingsStyles.css";

export default function SettingsApp() {
  const settings = useSettings();
  return <SettingsWindow settings={settings} />;
}
