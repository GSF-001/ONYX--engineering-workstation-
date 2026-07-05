import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardToolbar } from "./DashboardToolbar";
import { DashboardStatus } from "./DashboardStatus";
import { DashboardOverview } from "./DashboardOverview";
import { DashboardQuickLaunch } from "./DashboardQuickLaunch";
import { EmptyState, LoadingSpinner } from "../../shared/components";
import { useWindowManager } from "../../window-manager";
import type { useDashboardData } from "./DashboardHooks";
import { useState } from "react";
import { DashboardAPI } from "./DashboardAPI";
import { TrendChart, ActivityFeed } from "./DashboardOverview";

interface DashboardWindowProps {
  data: ReturnType<typeof useDashboardData>;
}

export function DashboardWindow({ data }: DashboardWindowProps) {
  const manager = useWindowManager();
  const [syncing, setSyncing] = useState(false);

  if (data.loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <LoadingSpinner label="Loading dashboard..." />
      </div>
    );
  }

  if (data.error) {
    return <EmptyState title="Couldn't load dashboard" description={data.error} />;
  }

  if (data.repositories.length === 0) {
    return (
      <EmptyState
        title="No repositories connected"
        description="Connect a GitHub repository from Settings to start seeing data here."
      />
    );
  }

  const selectedRepo = data.repositories.find((r) => r.id === data.selectedRepositoryId);
  const selectedScore = data.scores.find((s) => s.repositoryId === data.selectedRepositoryId);

  const handleSync = async () => {
    if (!data.selectedRepositoryId) return;
    setSyncing(true);
    try {
      await DashboardAPI.syncRepository(data.selectedRepositoryId);
      await data.reload();
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <DashboardToolbar onRefresh={() => void data.reload()} onOpenInsights={() => manager.open("insights")} />
      <DashboardHeader
        repository={selectedRepo as any}
        onSync={handleSync}
        syncing={syncing}
      />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <DashboardSidebar
          repositories={data.repositories}
          selectedId={data.selectedRepositoryId}
          onSelect={data.selectRepository}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ display: "flex", gap: 12, padding: 12 }}>
            <div style={{ width: 200 }}>
              <DashboardStatus score={selectedScore?.activityScore} />
            </div>
          </div>
          <DashboardOverview trend={data.trend} activity={data.activity} />
          <DashboardQuickLaunch />
        </div>
      </div>
    </div>
  );
}
