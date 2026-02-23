type DashboardDistributionInput = {
  createdAt: string;
  id: string;
  netAmount: number;
  projectTitle: string;
  status: string;
};

export type DashboardDistribution = {
  createdAt: string;
  id: string;
  netAmount: number;
  projectTitle: string;
  status: string;
};

export type DashboardDistributions = {
  items: DashboardDistribution[];
  pendingPayouts: number;
  totalPaid: number;
};

const hiddenStatuses = new Set(["cancelled"]);
const pendingStatuses = new Set(["pending", "processing"]);

export function buildDashboardDistributions(input: {
  distributions: DashboardDistributionInput[];
}): DashboardDistributions {
  const items = input.distributions
    .filter((distribution) => !hiddenStatuses.has(distribution.status))
    .map((distribution) => ({
      createdAt: distribution.createdAt,
      id: distribution.id || "unknown-distribution",
      netAmount: distribution.netAmount,
      projectTitle: distribution.projectTitle || "Unknown project",
      status: distribution.status || "unknown",
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    );

  return {
    items,
    pendingPayouts: items
      .filter((item) => pendingStatuses.has(item.status))
      .reduce((sum, item) => sum + item.netAmount, 0),
    totalPaid: items
      .filter((item) => item.status === "paid")
      .reduce((sum, item) => sum + item.netAmount, 0),
  };
}
