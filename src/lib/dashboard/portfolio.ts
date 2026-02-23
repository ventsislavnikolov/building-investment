type PortfolioInvestment = {
  amount: number;
  city: string;
  id: string;
  projectId: string;
  projectTitle: string;
  status: string;
};

type PortfolioPosition = {
  amount: number;
  city: string;
  id: string;
  projectId: string;
  projectTitle: string;
  status: string;
};

export type DashboardPortfolio = {
  activePositions: number;
  items: PortfolioPosition[];
  totalInvested: number;
};

export function buildPortfolioPositions(input: {
  investments: PortfolioInvestment[];
}): DashboardPortfolio {
  const qualifyingStatuses = new Set(["active", "returning", "exited"]);

  const items = input.investments
    .filter((investment) => qualifyingStatuses.has(investment.status))
    .sort((a, b) => b.amount - a.amount);

  const totalInvested = items.reduce((sum, item) => sum + item.amount, 0);

  return {
    activePositions: items.length,
    items,
    totalInvested,
  };
}
