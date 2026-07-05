import type { NotificationPrefs } from "./SettingsTypes";

const NOTIF_KEY = "onyx.notificationPrefs";
const AUTOSAVE_KEY = "onyx.autosaveWorkspace";

const DEFAULT_PREFS: NotificationPrefs = { desktopToasts: true, sound: true };

export function getNotificationPrefs(): NotificationPrefs {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(NOTIF_KEY) ?? "{}") };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function setNotificationPrefs(prefs: NotificationPrefs): void {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs));
}

export function getAutosaveWorkspace(): boolean {
  return localStorage.getItem(AUTOSAVE_KEY) !== "false"; // default true
}

export function setAutosaveWorkspace(value: boolean): void {
  localStorage.setItem(AUTOSAVE_KEY, String(value));
}
