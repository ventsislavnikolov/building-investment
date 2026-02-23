type ExposureInvestment = {
  amount: number;
  status: string;
};

type ExposureDistribution = {
  netAmount: number;
  status: string;
};

export type DashboardProjectExposure = {
  committedCapital: number;
  returnedCapital: number;
  outstandingCapital: number;
};

const qualifyingInvestmentStatuses = new Set(["active", "returning", "exited"]);
const qualifyingDistributionStatuses = new Set(["paid"]);

export function buildDashboardProjectExposure(input: {
  distributions: ExposureDistribution[];
  investments: ExposureInvestment[];
}): DashboardProjectExposure {
  const committedCapital = input.investments
    .filter((investment) => qualifyingInvestmentStatuses.has(investment.status))
    .reduce((sum, investment) => sum + investment.amount, 0);

  const returnedCapital = input.distributions
    .filter((distribution) =>
      qualifyingDistributionStatuses.has(distribution.status),
    )
    .reduce((sum, distribution) => sum + distribution.netAmount, 0);

  return {
    committedCapital,
    returnedCapital,
    outstandingCapital: committedCapital - returnedCapital,
  };
}
