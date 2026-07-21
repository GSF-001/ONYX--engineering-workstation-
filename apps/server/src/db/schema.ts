import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uniqueIndex,
  index,
  bigint,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    githubId: bigint("github_id", { mode: "number" }).notNull(),
    login: text("login").notNull(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    email: text("email"),
    accessToken: text("access_token").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    githubIdIdx: uniqueIndex("users_github_id_idx").on(t.githubId),
  })
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userAgent: text("user_agent"),
    ip: text("ip"),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index("sessions_user_id_idx").on(t.userId),
  })
);

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teamMembers = pgTable(
  "team_members",
  {
    id: serial("id").primaryKey(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["owner", "admin", "member"] })
      .notNull()
      .default("member"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    teamUserIdx: uniqueIndex("team_members_team_user_idx").on(t.teamId, t.userId),
  })
);

export const repositories = pgTable(
  "repositories",
  {
    id: serial("id").primaryKey(),
    teamId: integer("team_id").references(() => teams.id, { onDelete: "cascade" }),
    githubRepoId: bigint("github_repo_id", { mode: "number" }).notNull(),
    owner: text("owner").notNull(),
    name: text("name").notNull(),
    fullName: text("full_name").notNull(),
    defaultBranch: text("default_branch").default("main"),
    private: boolean("private").default(false),
    lastSyncedAt: timestamp("last_synced_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    githubRepoIdIdx: uniqueIndex("repositories_github_repo_id_idx").on(t.githubRepoId),
    fullNameIdx: index("repositories_full_name_idx").on(t.fullName),
  })
);

export const pullRequests = pgTable(
  "pull_requests",
  {
    id: serial("id").primaryKey(),
    repositoryId: integer("repository_id")
      .notNull()
      .references(() => repositories.id, { onDelete: "cascade" }),
    githubPrId: bigint("github_pr_id", { mode: "number" }).notNull(),
    number: integer("number").notNull(),
    title: text("title").notNull(),
    authorLogin: text("author_login").notNull(),
    state: text("state", { enum: ["open", "closed", "merged"] }).notNull(),
    additions: integer("additions").default(0),
    deletions: integer("deletions").default(0),
    changedFiles: integer("changed_files").default(0),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    mergedAt: timestamp("merged_at"),
    closedAt: timestamp("closed_at"),
    firstReviewAt: timestamp("first_review_at"),
  },
  (t) => ({
    githubPrIdIdx: uniqueIndex("pull_requests_github_pr_id_idx").on(t.githubPrId),
    repoIdx: index("pull_requests_repo_idx").on(t.repositoryId),
    stateIdx: index("pull_requests_state_idx").on(t.state),
  })
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    pullRequestId: integer("pull_request_id")
      .notNull()
      .references(() => pullRequests.id, { onDelete: "cascade" }),
    githubReviewId: bigint("github_review_id", { mode: "number" }).notNull(),
    reviewerLogin: text("reviewer_login").notNull(),
    state: text("state", {
      enum: ["approved", "changes_requested", "commented", "dismissed"],
    }).notNull(),
    submittedAt: timestamp("submitted_at").notNull(),
  },
  (t) => ({
    githubReviewIdIdx: uniqueIndex("reviews_github_review_id_idx").on(t.githubReviewId),
    prIdx: index("reviews_pr_idx").on(t.pullRequestId),
    reviewerIdx: index("reviews_reviewer_idx").on(t.reviewerLogin),
  })
);

export const issues = pgTable(
  "issues",
  {
    id: serial("id").primaryKey(),
    repositoryId: integer("repository_id")
      .notNull()
      .references(() => repositories.id, { onDelete: "cascade" }),
    githubIssueId: bigint("github_issue_id", { mode: "number" }).notNull(),
    number: integer("number").notNull(),
    title: text("title").notNull(),
    authorLogin: text("author_login").notNull(),
    state: text("state", { enum: ["open", "closed"] }).notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    closedAt: timestamp("closed_at"),
  },
  (t) => ({
    githubIssueIdIdx: uniqueIndex("issues_github_issue_id_idx").on(t.githubIssueId),
    repoIdx: index("issues_repo_idx").on(t.repositoryId),
  })
);

export const commits = pgTable(
  "commits",
  {
    id: serial("id").primaryKey(),
    repositoryId: integer("repository_id")
      .notNull()
      .references(() => repositories.id, { onDelete: "cascade" }),
    sha: text("sha").notNull(),
    authorLogin: text("author_login"),
    authorEmail: text("author_email"),
    message: text("message").notNull(),
    additions: integer("additions").default(0),
    deletions: integer("deletions").default(0),
    committedAt: timestamp("committed_at").notNull(),
  },
  (t) => ({
    shaIdx: uniqueIndex("commits_sha_idx").on(t.sha),
    repoIdx: index("commits_repo_idx").on(t.repositoryId),
    committedAtIdx: index("commits_committed_at_idx").on(t.committedAt),
  })
);

export const checkRuns = pgTable(
  "check_runs",
  {
    id: serial("id").primaryKey(),
    repositoryId: integer("repository_id")
      .notNull()
      .references(() => repositories.id, { onDelete: "cascade" }),
    githubCheckRunId: bigint("github_check_run_id", { mode: "number" }).notNull(),
    name: text("name").notNull(),
    status: text("status").notNull(),
    conclusion: text("conclusion"),
    headSha: text("head_sha").notNull(),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
  },
  (t) => ({
    githubCheckRunIdIdx: uniqueIndex("check_runs_github_check_run_id_idx").on(
      t.githubCheckRunId
    ),
    repoIdx: index("check_runs_repo_idx").on(t.repositoryId),
  })
);

export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: serial("id").primaryKey(),
    deliveryId: text("delivery_id").notNull(),
    event: text("event").notNull(),
    action: text("action"),
    repositoryFullName: text("repository_full_name"),
    payload: jsonb("payload").notNull(),
    status: text("status", { enum: ["pending", "processed", "failed"] })
      .notNull()
      .default("pending"),
    attempts: integer("attempts").default(0),
    error: text("error"),
    receivedAt: timestamp("received_at").defaultNow().notNull(),
    processedAt: timestamp("processed_at"),
  },
  (t) => ({
    deliveryIdIdx: uniqueIndex("webhook_events_delivery_id_idx").on(t.deliveryId),
    statusIdx: index("webhook_events_status_idx").on(t.status),
  })
);

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    read: boolean("read").default(false),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index("notifications_user_idx").on(t.userId),
  })
);

export const exportJobs = pgTable("export_jobs", {
  id: serial("id").primaryKey(),
  requestedByUserId: integer("requested_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  repositoryId: integer("repository_id").references(() => repositories.id, {
    onDelete: "cascade",
  }),
  format: text("format", { enum: ["csv", "json"] }).notNull(),
  status: text("status", { enum: ["pending", "ready", "failed"] })
    .notNull()
    .default("pending"),
  filePath: text("file_path"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const communityPosts = pgTable(
  "community_posts",
  {
    id: serial("id").primaryKey(),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type", { enum: ["project", "discussion", "showcase", "event"] }).notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    url: text("url"),
    eventAt: timestamp("event_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    typeIdx: index("community_posts_type_idx").on(t.type),
    createdAtIdx: index("community_posts_created_at_idx").on(t.createdAt),
  })
);

export const communityPostLikes = pgTable(
  "community_post_likes",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => communityPosts.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    postUserIdx: uniqueIndex("community_post_likes_post_user_idx").on(t.postId, t.userId),
  })
);

export const communityPostComments = pgTable(
  "community_post_comments",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => communityPosts.id, { onDelete: "cascade" }),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    postIdx: index("community_post_comments_post_idx").on(t.postId),
  })
);

export const communityPostsRelations = relations(communityPosts, ({ many, one }) => ({
  likes: many(communityPostLikes),
  comments: many(communityPostComments),
  author: one(users, { fields: [communityPosts.authorId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  teamMemberships: many(teamMembers),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(teamMembers),
  repositories: many(repositories),
}));

export const repositoriesRelations = relations(repositories, ({ many, one }) => ({
  pullRequests: many(pullRequests),
  issues: many(issues),
  commits: many(commits),
  team: one(teams, { fields: [repositories.teamId], references: [teams.id] }),
}));

export const pullRequestsRelations = relations(pullRequests, ({ many, one }) => ({
  reviews: many(reviews),
  repository: one(repositories, {
    fields: [pullRequests.repositoryId],
    references: [repositories.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  pullRequest: one(pullRequests, {
    fields: [reviews.pullRequestId],
    references: [pullRequests.id],
  }),
}));
