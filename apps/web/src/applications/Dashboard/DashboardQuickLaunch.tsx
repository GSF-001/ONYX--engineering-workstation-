import { useWindowManager } from "../../window-manager";

const QUICK_APPS: { appId: string; label: string }[] = [
  { appId: "pullRequests", label: "Pull Requests" },
  { appId: "reviews", label: "Reviews" },
  { appId: "insights", label: "Insights" },
  { appId: "terminal", label: "Terminal" },
];

export function DashboardQuickLaunch() {
  const manager = useWindowManager();

  return (
    <div style={{ display: "flex", gap: 6, padding: "0 12px 12px" }}>
      {QUICK_APPS.map((app) => (
        <button
          key={app.appId}
          className="win-button"
          style={{ width: "auto", padding: "4px 10px" }}
          onClick={() => manager.open(app.appId)}
        >
          {app.label}
        </button>
      ))}
    </div>
  );
}
