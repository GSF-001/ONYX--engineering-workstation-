import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { commits, issues, pullRequests, repositories, reviews } from "../db/schema.js";
import { createGitHubClient } from "./github.js";
import { logger } from "./logger.js";
import { cache } from "./cache.js";

interface GhPullRequest {
  id: number;
  number: number;
  title: string;
  user: { login: string };
  state: "open" | "closed";
  merged_at: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  additions?: number;
  deletions?: number;
  changed_files?: number;
}

interface GhReview {
  id: number;
  user: { login: string } | null;
  state: string;
  submitted_at: string;
}

interface GhIssue {
  id: number;
  number: number;
  title: string;
  user: { login: string };
  state: "open" | "closed";
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  pull_request?: unknown;
}

interface GhCommit {
  sha: string;
  commit: { message: string; author: { date: string } | null };
  author: { login: string } | null;
  commit_author_email?: string;
}

export async function syncRepository(repositoryId: number, accessToken: string): Promise<void> {
  const [repo] = await db.select().from(repositories).where(eq(repositories.id, repositoryId));
  if (!repo) throw new Error(`Repository ${repositoryId} not found`);

  const client = createGitHubClient(accessToken);
  logger.info({ repo: repo.fullName }, "Starting repository sync");

  const ghPrs = (await client.listPullRequests(repo.owner, repo.name, "all")) as GhPullRequest[];

  for (const pr of ghPrs) {
    const [row] = await db
      .insert(pullRequests)
      .values({
        repositoryId: repo.id,
        githubPrId: pr.id,
        number: pr.number,
        title: pr.title,
        authorLogin: pr.user.login,
        state: pr.merged_at ? "merged" : pr.state,
        additions: pr.additions ?? 0,
        deletions: pr.deletions ?? 0,
        changedFiles: pr.changed_files ?? 0,
        createdAt: new Date(pr.created_at),
        updatedAt: new Date(pr.updated_at),
        mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
        closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
      })
      .onConflictDoUpdate({
        target: pullRequests.githubPrId,
        set: {
          title: pr.title,
          state: pr.merged_at ? "merged" : pr.state,
          updatedAt: new Date(pr.updated_at),
          mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
          closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
        },
      })
      .returning();

    const ghReviews = (await client.listPullRequestReviews(
      repo.owner,
      repo.name,
      pr.number
    )) as GhReview[];

    for (const review of ghReviews) {
      if (!review.user) continue;
      await db
        .insert(reviews)
        .values({
          pullRequestId: row.id,
          githubReviewId: review.id,
          reviewerLogin: review.user.login,
          state: review.state.toLowerCase() as
            | "approved"
            | "changes_requested"
            | "commented"
            | "dismissed",
          submittedAt: new Date(review.submitted_at),
        })
        .onConflictDoNothing({ target: reviews.githubReviewId });
    }

    const firstReview = ghReviews[0];
    if (firstReview) {
      await db
        .update(pullRequests)
        .set({ firstReviewAt: new Date(firstReview.submitted_at) })
        .where(eq(pullRequests.id, row.id));
    }
  }

  const ghIssues = (await client.listIssues(repo.owner, repo.name, "all")) as GhIssue[];
  for (const issue of ghIssues) {
    if (issue.pull_request) continue;
    await db
      .insert(issues)
      .values({
        repositoryId: repo.id,
        githubIssueId: issue.id,
        number: issue.number,
        title: issue.title,
        authorLogin: issue.user.login,
        state: issue.state,
        createdAt: new Date(issue.created_at),
        updatedAt: new Date(issue.updated_at),
        closedAt: issue.closed_at ? new Date(issue.closed_at) : null,
      })
      .onConflictDoUpdate({
        target: issues.githubIssueId,
        set: {
          state: issue.state,
          updatedAt: new Date(issue.updated_at),
          closedAt: issue.closed_at ? new Date(issue.closed_at) : null,
        },
      });
  }

  const ghCommits = (await client.listCommits(repo.owner, repo.name)) as GhCommit[];
  for (const commit of ghCommits) {
    if (!commit.commit.author) continue;
    await db
      .insert(commits)
      .values({
        repositoryId: repo.id,
        sha: commit.sha,
        authorLogin: commit.author?.login ?? null,
        authorEmail: null,
        message: commit.commit.message,
        committedAt: new Date(commit.commit.author.date),
      })
      .onConflictDoNothing({ target: commits.sha });
  }

  await db
    .update(repositories)
    .set({ lastSyncedAt: new Date() })
    .where(eq(repositories.id, repo.id));

  cache.invalidatePrefix(`analytics:${repo.id}:`);
  logger.info({ repo: repo.fullName }, "Repository sync complete");
}
