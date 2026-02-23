import { buildDashboardProjectExposure } from "@/lib/dashboard/project-exposure";

describe("dashboard project exposure", () => {
  it("aggregates committed, returned, and outstanding capital", () => {
    const result = buildDashboardProjectExposure({
      distributions: [
        { netAmount: 120, status: "paid" },
        { netAmount: 30, status: "pending" },
      ],
      investments: [
        { amount: 1000, status: "active" },
        { amount: 200, status: "cancelled" },
        { amount: 500, status: "returning" },
      ],
    });

    expect(result.committedCapital).toBe(1500);
    expect(result.returnedCapital).toBe(120);
    expect(result.outstandingCapital).toBe(1380);
  });

  it("returns zero exposure for empty data", () => {
    const result = buildDashboardProjectExposure({
      distributions: [],
      investments: [],
    });

    expect(result).toEqual({
      committedCapital: 0,
      outstandingCapital: 0,
      returnedCapital: 0,
    });
  });
});
