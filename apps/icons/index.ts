import type { ComponentType } from "react";
import { DashboardIcon } from "./Dashboard";
import { RepositoryIcon } from "./Repository";
import { PullRequestsIcon } from "./PullRequests";
import { ReviewsIcon } from "./Reviews";
import { IssuesIcon } from "./Issues";
import { InsightsIcon } from "./Insights";
import { TeamIcon } from "./Team";
import { ReportsIcon } from "./Reports";
import { HeatmapIcon } from "./Heatmap";
import { ActivityIcon } from "./Activity";
import { TerminalIcon } from "./Terminal";
import { SettingsIcon } from "./Settings";

/** Maps the `icon` string on each WindowAppDefinition (window-manager/
 * WindowRegistry.ts) to its actual pixel-art component. Central lookup so
 * DesktopIcon and Taskbar render identically without each hardcoding a
 * switch statement. */
export const APP_ICONS: Record<string, ComponentType> = {
  dashboard: DashboardIcon,
  repository: RepositoryIcon,
  pullRequests: PullRequestsIcon,
  reviews: ReviewsIcon,
  issues: IssuesIcon,
  insights: InsightsIcon,
  team: TeamIcon,
  reports: ReportsIcon,
  heatmap: HeatmapIcon,
  activity: ActivityIcon,
  terminal: TerminalIcon,
  settings: SettingsIcon,
};

export {
  DashboardIcon,
  RepositoryIcon,
  PullRequestsIcon,
  ReviewsIcon,
  IssuesIcon,
  InsightsIcon,
  TeamIcon,
  ReportsIcon,
  HeatmapIcon,
  ActivityIcon,
  TerminalIcon,
  SettingsIcon,
};
