import { buildDashboardInvestments } from "@/lib/dashboard/investments";

describe("dashboard investments", () => {
  it("normalizes investments, excludes cancelled/refunded, and sorts newest first", () => {
    const result = buildDashboardInvestments({
      investments: [
        {
          amount: 1200,
          createdAt: "2025-02-14T12:00:00.000Z",
          id: "inv-1",
          projectTitle: "Sofia Apartment Reposition",
          status: "active",
        },
        {
          amount: 950,
          createdAt: "2025-02-20T10:30:00.000Z",
          id: "inv-2",
          projectTitle: "Varna Seaside Rentals",
          status: "reserved",
        },
        {
          amount: 700,
          createdAt: "2025-02-21T08:00:00.000Z",
          id: "inv-3",
          projectTitle: "Plovdiv Urban Hub",
          status: "cancelled",
        },
      ],
    });

    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe("inv-2");
    expect(result.items[1].id).toBe("inv-1");
    expect(result.totalCommitted).toBe(2150);
    expect(result.openCommitments).toBe(2);
  });

  it("returns safe defaults for missing values", () => {
    const result = buildDashboardInvestments({
      investments: [
        {
          amount: 0,
          createdAt: "",
          id: "",
          projectTitle: "",
          status: "",
        },
      ],
    });

    expect(result.items[0]).toMatchObject({
      id: "unknown-investment",
      projectTitle: "Unknown project",
      status: "unknown",
    });
  });
});
