type DashboardInvestmentInput = {
  amount: number;
  createdAt: string;
  id: string;
  projectTitle: string;
  status: string;
};

export type DashboardInvestment = {
  amount: number;
  createdAt: string;
  id: string;
  projectTitle: string;
  status: string;
};

export type DashboardInvestments = {
  items: DashboardInvestment[];
  openCommitments: number;
  totalCommitted: number;
};

const hiddenStatuses = new Set(["cancelled", "refunded"]);
const openStatuses = new Set([
  "reserved",
  "pending_payment",
  "active",
  "returning",
]);

export function buildDashboardInvestments(input: {
  investments: DashboardInvestmentInput[];
}): DashboardInvestments {
  const items = input.investments
    .filter((investment) => !hiddenStatuses.has(investment.status))
    .map((investment) => ({
      amount: investment.amount,
      createdAt: investment.createdAt,
      id: investment.id || "unknown-investment",
      projectTitle: investment.projectTitle || "Unknown project",
      status: investment.status || "unknown",
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    );

  return {
    items,
    openCommitments: items.filter((item) => openStatuses.has(item.status))
      .length,
    totalCommitted: items.reduce((sum, item) => sum + item.amount, 0),
  };
}
