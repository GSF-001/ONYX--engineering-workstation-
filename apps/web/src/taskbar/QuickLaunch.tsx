const QUICK_LAUNCH_APPS = ["dashboard", "pullRequests", "reviews", "terminal"];

interface QuickLaunchProps {
  onOpenApp: (appId: string) => void;
}

export function QuickLaunch({ onOpenApp }: QuickLaunchProps) {
  return (
    <div style={{ display: "flex", gap: 2, borderRight: "1px solid var(--win-face-dark)", paddingRight: 6 }}>
      {QUICK_LAUNCH_APPS.map((appId) => (
        <button
          key={appId}
          className="win-button"
          onClick={() => onOpenApp(appId)}
          style={{ height: "100%", width: 28 }}
          title={appId}
        >
          ▣
        </button>
      ))}
    </div>
  );
}
