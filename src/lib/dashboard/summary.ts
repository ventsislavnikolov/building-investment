type InvestmentRow = {
  amount: number;
  status: string;
};

type DistributionRow = {
  netAmount: number;
};

export type DashboardSummary = {
  activeInvestments: number;
  totalInvested: number;
  totalReturned: number;
  netExposure: number;
};

export function buildDashboardSummary(input: {
  investments: InvestmentRow[];
  distributions: DistributionRow[];
}): DashboardSummary {
  const qualifyingStatuses = new Set(["active", "returning", "exited"]);

  const qualifyingInvestments = input.investments.filter((investment) =>
    qualifyingStatuses.has(investment.status),
  );

  const totalInvested = qualifyingInvestments.reduce(
    (sum, investment) => sum + investment.amount,
    0,
  );

  const totalReturned = input.distributions.reduce(
    (sum, distribution) => sum + distribution.netAmount,
    0,
  );

  return {
    activeInvestments: qualifyingInvestments.length,
    totalInvested,
    totalReturned,
    netExposure: totalInvested - totalReturned,
  };
}
