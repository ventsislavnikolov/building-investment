import { buildDashboardSummary } from "@/lib/dashboard/summary";

describe("dashboard summary", () => {
  it("aggregates invested and returned totals", () => {
    const summary = buildDashboardSummary({
      investments: [
        { amount: 1000, status: "active" },
        { amount: 500, status: "returning" },
        { amount: 200, status: "cancelled" },
      ],
      distributions: [{ netAmount: 120 }, { netAmount: 80 }],
    });

    expect(summary.activeInvestments).toBe(2);
    expect(summary.totalInvested).toBe(1500);
    expect(summary.totalReturned).toBe(200);
    expect(summary.netExposure).toBe(1300);
  });

  it("returns zeros for empty data", () => {
    const summary = buildDashboardSummary({
      investments: [],
      distributions: [],
    });

    expect(summary.activeInvestments).toBe(0);
    expect(summary.totalInvested).toBe(0);
    expect(summary.totalReturned).toBe(0);
    expect(summary.netExposure).toBe(0);
  });
});
