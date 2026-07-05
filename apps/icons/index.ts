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
import { CommunityIcon } from "./Community";
import { GroupsIcon } from "./Groups";
import { ProfileIcon } from "./Profile";

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
  community: CommunityIcon,
  groups: GroupsIcon,
  profile: ProfileIcon,
};

export {
  DashboardIcon, RepositoryIcon, PullRequestsIcon, ReviewsIcon, IssuesIcon,
  InsightsIcon, TeamIcon, ReportsIcon, HeatmapIcon, ActivityIcon,
  TerminalIcon, SettingsIcon, CommunityIcon, GroupsIcon, ProfileIcon,
};
