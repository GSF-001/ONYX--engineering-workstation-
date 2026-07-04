import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { exportJobs } from "../db/schema.js";
import { getRepositoryInsights } from "./analytics.js";
import { saveExportFile } from "./storage.js";
import { logger } from "./logger.js";

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      headers
        .map((h) => {
          const value = row[h] ?? "";
          const str = typeof value === "object" ? JSON.stringify(value) : String(value);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(",")
    );
  }
  return lines.join("\n");
}

export async function createExportJob(
  requestedByUserId: number,
  repositoryId: number,
  format: "csv" | "json"
): Promise<{ id: number; filePath: string }> {
  const [job] = await db
    .insert(exportJobs)
    .values({ requestedByUserId, repositoryId, format, status: "pending" })
    .returning();

  try {
    const insights = await getRepositoryInsights(repositoryId);

    let content: string;
    if (format === "json") {
      content = JSON.stringify(insights, null, 2);
    } else {
      content = toCsv([
        {
          repositoryId: insights.repositoryId,
          overallScore: insights.activityScore.overallScore,
          reviewHealthScore: insights.reviewHealth.score,
          busFactor: insights.busFactor.busFactor,
          staleItems: insights.staleRadar.length,
          mergeWithoutReviewCount: insights.mergeWithoutReview.length,
          weekendCommitRatio: insights.weekendHeatmap.weekendCommitRatio,
          generatedAt: insights.generatedAt,
        },
      ]);
    }

    const filePath = await saveExportFile(content, format);

    await db
      .update(exportJobs)
      .set({ status: "ready", filePath, completedAt: new Date() })
      .where(eq(exportJobs.id, job.id));

    return { id: job.id, filePath };
  } catch (err) {
    logger.error({ err, jobId: job.id }, "Export job failed");
    await db.update(exportJobs).set({ status: "failed" }).where(eq(exportJobs.id, job.id));
    throw err;
  }
}
