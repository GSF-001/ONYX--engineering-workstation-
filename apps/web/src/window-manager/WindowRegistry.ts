import { lazy, type LazyExoticComponent } from "react";
import { TOKENS } from "../theme";

export interface WindowAppDefinition {
  id: string;
  title: string;
  icon: string; // path or inline data URI, resolved by DesktopIcon
  defaultWidth: number;
  defaultHeight: number;
  component: LazyExoticComponent<() => JSX.Element>;
}

/**
 * Maps an appId to the component rendered inside its window. App
 * components themselves live under `../applications/<Name>` (per-app
 * folders with *App.tsx as default export) — except "terminal", whose
 * real implementation lives at the top-level `../terminal/Terminal`
 * module; `../applications/Terminal` is just a thin re-export wrapper
 * around it, but importing the real module directly here avoids an
 * unnecessary extra hop.
 */
export const WINDOW_REGISTRY: Record<string, WindowAppDefinition> = {
  dashboard: {
    id: "dashboard",
    title: "Dashboard",
    icon: "dashboard",
    defaultWidth: 760,
    defaultHeight: 520,
    component: lazy(() => import("../applications/Dashboard")),
  },
  repository: {
    id: "repository",
    title: "Repository",
    icon: "repository",
    defaultWidth: 640,
    defaultHeight: 460,
    component: lazy(() => import("../applications/Repository")),
  },
  pullRequests: {
    id: "pullRequests",
    title: "Pull Requests",
    icon: "pullRequests",
    defaultWidth: 720,
    defaultHeight: 480,
    component: lazy(() => import("../applications/PullRequests")),
  },
  reviews: {
    id: "reviews",
    title: "Reviews",
    icon: "reviews",
    defaultWidth: 680,
    defaultHeight: 460,
    component: lazy(() => import("../applications/Reviews")),
  },
  issues: {
    id: "issues",
    title: "Issues",
    icon: "issues",
    defaultWidth: 640,
    defaultHeight: 440,
    component: lazy(() => import("../applications/Issues")),
  },
  insights: {
    id: "insights",
    title: "Insights",
    icon: "insights",
    defaultWidth: 720,
    defaultHeight: 520,
    component: lazy(() => import("../applications/Insights")),
  },
  team: {
    id: "team",
    title: "Team",
    icon: "team",
    defaultWidth: 680,
    defaultHeight: 460,
    component: lazy(() => import("../applications/Team")),
  },
  reports: {
    id: "reports",
    title: "Reports",
    icon: "reports",
    defaultWidth: 560,
    defaultHeight: 420,
    component: lazy(() => import("../applications/Reports")),
  },
  heatmap: {
    id: "heatmap",
    title: "Heatmap",
    icon: "heatmap",
    defaultWidth: 720,
    defaultHeight: 420,
    component: lazy(() => import("../applications/Heatmap")),
  },
  activity: {
    id: "activity",
    title: "Activity",
    icon: "activity",
    defaultWidth: 640,
    defaultHeight: 440,
    component: lazy(() => import("../applications/Activity")),
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    icon: "terminal",
    defaultWidth: 600,
    defaultHeight: 380,
    component: lazy(() => import("../terminal/Terminal")),
  },
  settings: {
    id: "settings",
    title: "Settings",
    icon: "settings",
    defaultWidth: 600,
    defaultHeight: 440,
    component: lazy(() => import("../applications/Settings")),
  },
  community: {
    id: "community",
    title: "Community",
    icon: "community",
    defaultWidth: 760,
    defaultHeight: 520,
    component: lazy(() => import("../applications/Community")),
  },
  groups: {
    id: "groups",
    title: "Groups",
    icon: "groups",
    defaultWidth: 760,
    defaultHeight: 520,
    component: lazy(() => import("../applications/Groups")),
  },
  profile: {
    id: "profile",
    title: "Profile",
    icon: "profile",
    defaultWidth: 640,
    defaultHeight: 480,
    component: lazy(() => import("../applications/Profile")),
  },
};

export function getWindowDefaults(appId: string) {
  const def = WINDOW_REGISTRY[appId];
  return {
    width: def?.defaultWidth ?? TOKENS.window.defaultWidth,
    height: def?.defaultHeight ?? TOKENS.window.defaultHeight,
  };
}
