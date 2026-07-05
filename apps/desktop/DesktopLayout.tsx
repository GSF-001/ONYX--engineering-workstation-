import type { ReactNode } from "react";

interface DesktopLayoutProps {
  background: ReactNode;
  icons: ReactNode;
  windows: ReactNode;
  taskbar: ReactNode;
  overlays: ReactNode;
}

/** Pure layering/z-order composition — keeps Desktop.tsx focused on state
 * wiring instead of also being responsible for stacking order. */
export function DesktopLayout({ background, icons, windows, taskbar, overlays }: DesktopLayoutProps) {
  return (
    <div className="win-desktop" style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      {background}
      {icons}
      {windows}
      {taskbar}
      {overlays}
    </div>
  );
}
