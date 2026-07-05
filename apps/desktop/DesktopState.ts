import { useCallback, useEffect, useState } from "react";

export interface IconPosition {
  appId: string;
  x: number;
  y: number;
  label: string;
}

const STORAGE_KEY = "onyx.desktopIcons";
const GRID_COL_WIDTH = 84;
const GRID_ROW_HEIGHT = 92;

function defaultPositions(appIds: string[], labels: Record<string, string>): IconPosition[] {
  return appIds.map((appId, i) => ({
    appId,
    label: labels[appId] ?? appId,
    x: 16 + (i % 2) * GRID_COL_WIDTH * 0, // placeholder, replaced below
    y: 0,
  }));
}

function layoutInColumns(appIds: string[], labels: Record<string, string>): IconPosition[] {
  const perColumn = 5;
  return appIds.map((appId, i) => ({
    appId,
    label: labels[appId] ?? appId,
    x: 16 + Math.floor(i / perColumn) * GRID_COL_WIDTH,
    y: 16 + (i % perColumn) * GRID_ROW_HEIGHT,
  }));
}

/**
 * Owns desktop icon positions + selection + rename state, persisted to
 * localStorage so a rearranged desktop survives a reload/reboot.
 */
export function useDesktopState(appIds: string[], labels: Record<string, string>) {
  const [positions, setPositions] = useState<IconPosition[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as IconPosition[];
        // Merge: keep saved positions, add any new apps that weren't there before.
        const savedIds = new Set(saved.map((p) => p.appId));
        const missing = appIds.filter((id) => !savedIds.has(id));
        return [...saved.filter((p) => appIds.includes(p.appId)), ...layoutInColumns(missing, labels)];
      }
    } catch {
      // fall through to defaults
    }
    return layoutInColumns(appIds, labels);
  });

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [renamingAppId, setRenamingAppId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  }, [positions]);

  const movePosition = useCallback((appId: string, x: number, y: number) => {
    setPositions((prev) => prev.map((p) => (p.appId === appId ? { ...p, x, y } : p)));
  }, []);

  const renameIcon = useCallback((appId: string, label: string) => {
    setPositions((prev) => prev.map((p) => (p.appId === appId ? { ...p, label } : p)));
    setRenamingAppId(null);
  }, []);

  const resetLayout = useCallback(() => {
    setPositions(layoutInColumns(appIds, labels));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    positions,
    selectedAppId,
    setSelectedAppId,
    renamingAppId,
    setRenamingAppId,
    movePosition,
    renameIcon,
    resetLayout,
  };
}
