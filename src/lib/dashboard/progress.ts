type DashboardProgressInput = {
  budgetStatus: string;
  id: string;
  projectTitle: string;
  publishedAt: string;
  timelineStatus: string;
  title: string;
};

export type DashboardProgressUpdate = {
  budgetStatus: string;
  id: string;
  projectTitle: string;
  publishedAt: string;
  timelineStatus: string;
  title: string;
};

export function buildDashboardProgress(input: {
  updates: DashboardProgressInput[];
}): DashboardProgressUpdate[] {
  return input.updates
    .filter((update) => Boolean(update.publishedAt))
    .map((update) => ({
      budgetStatus: update.budgetStatus || "unknown",
      id: update.id || "unknown-update",
      projectTitle: update.projectTitle || "Unknown project",
      publishedAt: update.publishedAt,
      timelineStatus: update.timelineStatus || "unknown",
      title: update.title || "Untitled update",
    }))
    .sort(
      (a, b) =>
        new Date(b.publishedAt || 0).getTime() -
        new Date(a.publishedAt || 0).getTime(),
    );
}
