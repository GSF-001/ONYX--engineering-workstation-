import type { ReactNode } from "react";

interface WindowToolbarProps {
  children: ReactNode;
}

/** Generic slot for a secondary row of quick-action buttons below the
 * menu bar. Content is entirely app-specific. */
export function WindowToolbar({ children }: WindowToolbarProps) {
  return <div className="win-toolbar">{children}</div>;
}
