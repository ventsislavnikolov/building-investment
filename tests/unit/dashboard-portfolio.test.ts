import { buildPortfolioPositions } from "@/lib/dashboard/portfolio";

describe("dashboard portfolio", () => {
  it("keeps only qualifying investment statuses and sorts by exposure", () => {
    const portfolio = buildPortfolioPositions({
      investments: [
        {
          id: "i1",
          amount: 900,
          status: "returning",
          projectId: "p1",
          projectTitle: "Sofia Apartment Reposition",
          city: "Sofia",
        },
        {
          id: "i2",
          amount: 1200,
          status: "active",
          projectId: "p2",
          projectTitle: "Varna Seaside Rentals",
          city: "Varna",
        },
        {
          id: "i3",
          amount: 300,
          status: "cancelled",
          projectId: "p3",
          projectTitle: "Plovdiv Urban Hub",
          city: "Plovdiv",
        },
      ],
    });

    expect(portfolio.activePositions).toBe(2);
    expect(portfolio.totalInvested).toBe(2100);
    expect(portfolio.items).toHaveLength(2);
    expect(portfolio.items[0].projectTitle).toBe("Varna Seaside Rentals");
    expect(portfolio.items[1].projectTitle).toBe("Sofia Apartment Reposition");
  });

  it("returns empty portfolio for no qualifying investments", () => {
    const portfolio = buildPortfolioPositions({
      investments: [
        {
          amount: 100,
          city: "Sofia",
          id: "1",
          projectId: "p1",
          projectTitle: "A",
          status: "reserved",
        },
      ],
    });

    expect(portfolio.activePositions).toBe(0);
    expect(portfolio.totalInvested).toBe(0);
    expect(portfolio.items).toHaveLength(0);
  });
});
