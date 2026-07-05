import { useState } from "react";
import { DesktopLayout } from "./DesktopLayout";
import { DesktopBackground } from "./DesktopBackground";
import { DesktopGrid } from "./DesktopGrid";
import { ContextMenu, type ContextMenuAction } from "./ContextMenu";
import { useDesktopState } from "./DesktopState";
import { WorkspaceLoadedToast } from "./WorkspaceLoadedToast";
import { WindowManager, useWindowManager, WINDOW_REGISTRY, saveWindowLayout } from "../window-manager";
import { Taskbar } from "../taskbar";
import { CommandPalette } from "../command-palette";
import { NotificationManager, Popup, LiveNotification } from "../notifications";
import { ThemeProvider } from "../theme";

const APP_IDS = Object.keys(WINDOW_REGISTRY);
const APP_LABELS = Object.fromEntries(APP_IDS.map((id) => [id, WINDOW_REGISTRY[id].title]));

/**
 * Everything that isn't a window frame: icon grid, taskbar, context menus,
 * command palette, toasts. Rendered as WindowManager's `children`, so it's
 * inside the same WindowContextProvider the window frames use — one
 * shared window state for the whole desktop, not two competing ones.
 */
function DesktopChrome() {
  const manager = useWindowManager();
  const desktop = useDesktopState(APP_IDS, APP_LABELS);
  const [menu, setMenu] = useState<{ x: number; y: number; actions: ContextMenuAction[] } | null>(null);
  const [loadedWorkspaceName, setLoadedWorkspaceName] = useState<string | null>(null);

  const openDesktopMenu = (e: React.MouseEvent) => {
    setMenu({
      x: e.clientX,
      y: e.clientY,
      actions: [
        { label: "Refresh", onSelect: () => window.location.reload() },
        { label: "Save current layout...", onSelect: () => manager.open("settings") },
        { label: "Reset icon layout", onSelect: desktop.resetLayout },
        { label: "Desktop Settings...", onSelect: () => manager.open("settings") },
      ],
    });
  };

  const openIconMenu = (appId: string, e: React.MouseEvent) => {
    setMenu({
      x: e.clientX,
      y: e.clientY,
      actions: [
        { label: "Open", onSelect: () => manager.open(appId) },
        { label: "Rename", onSelect: () => desktop.setRenamingAppId(appId) },
        { label: "Save layout snapshot", onSelect: () => saveWindowLayout(manager.windows) },
      ],
    });
  };

  return (
    <DesktopLayout
      background={
        <DesktopBackground onClick={() => desktop.setSelectedAppId(null)} onContextMenu={openDesktopMenu} />
      }
      icons={
        <DesktopGrid
          positions={desktop.positions}
          selectedAppId={desktop.selectedAppId}
          renamingAppId={desktop.renamingAppId}
          onSelect={desktop.setSelectedAppId}
          onOpen={manager.open}
          onMove={desktop.movePosition}
          onRename={desktop.renameIcon}
          onIconContextMenu={openIconMenu}
        />
      }
      taskbar={<Taskbar />}
      overlays={
        <>
          <CommandPalette />
          <Popup />
          <LiveNotification />
          <WorkspaceLoadedToast
            workspaceName={loadedWorkspaceName}
            onDismiss={() => setLoadedWorkspaceName(null)}
          />
          {menu && <ContextMenu x={menu.x} y={menu.y} actions={menu.actions} onClose={() => setMenu(null)} />}
        </>
      }
    />
  );
}

/**
 * Top-level desktop composition, replacing the temporary DesktopIconGrid
 * stand-in in pages/DesktopPage.tsx. WindowManager owns the single
 * WindowContextProvider for the whole desktop — DesktopChrome (icons,
 * taskbar, menus) and the actual window frames (rendered internally by
 * WindowManager) both read from that one shared state.
 */
export function Desktop() {
  return (
    <ThemeProvider>
      <NotificationManager>
        <WindowManager>
          <DesktopChrome />
        </WindowManager>
      </NotificationManager>
    </ThemeProvider>
  );
}
