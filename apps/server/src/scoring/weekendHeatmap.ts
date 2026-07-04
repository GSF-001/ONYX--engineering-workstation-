import { listCommitsForRepoSince } from "../db/queries.js";

export interface HeatmapCell {
  dayOfWeek: number;
  hour: number;
  count: number;
}

export interface WeekendHeatmapResult {
  cells: HeatmapCell[];
  weekendCommitRatio: number;
}

export async function computeWeekendHeatmap(
  repositoryId: number,
  windowDays = 90
): Promise<WeekendHeatmapResult> {
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
  const commitRows = await listCommitsForRepoSince(repositoryId, since);

  const grid = new Map<string, number>();
  let weekendCount = 0;

  for (const commit of commitRows) {
    const day = commit.committedAt.getDay();
    const hour = commit.committedAt.getHours();
    const key = `${day}:${hour}`;
    grid.set(key, (grid.get(key) ?? 0) + 1);
    if (day === 0 || day === 6) weekendCount += 1;
  }

  const cells: HeatmapCell[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      cells.push({ dayOfWeek: day, hour, count: grid.get(`${day}:${hour}`) ?? 0 });
    }
  }

  return {
    cells,
    weekendCommitRatio: commitRows.length > 0 ? weekendCount / commitRows.length : 0,
  };
}
