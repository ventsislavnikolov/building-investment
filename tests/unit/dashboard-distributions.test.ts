import { buildDashboardDistributions } from "@/lib/dashboard/distributions";

describe("dashboard distributions", () => {
  it("normalizes, sorts, and aggregates paid and pending payouts", () => {
    const result = buildDashboardDistributions({
      distributions: [
        {
          createdAt: "2025-02-10T10:00:00.000Z",
          id: "dist-1",
          netAmount: 80,
          projectTitle: "Varna Seaside Rentals",
          status: "paid",
        },
        {
          createdAt: "2025-02-20T10:00:00.000Z",
          id: "dist-2",
          netAmount: 120,
          projectTitle: "Sofia Apartment Reposition",
          status: "pending",
        },
        {
          createdAt: "2025-02-21T10:00:00.000Z",
          id: "dist-3",
          netAmount: 20,
          projectTitle: "Plovdiv Urban Hub",
          status: "cancelled",
        },
      ],
    });

    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe("dist-2");
    expect(result.items[1].id).toBe("dist-1");
    expect(result.totalPaid).toBe(80);
    expect(result.pendingPayouts).toBe(120);
  });

  it("returns safe defaults for missing values", () => {
    const result = buildDashboardDistributions({
      distributions: [
        {
          createdAt: "",
          id: "",
          netAmount: 0,
          projectTitle: "",
          status: "",
        },
      ],
    });

    expect(result.items[0]).toMatchObject({
      id: "unknown-distribution",
      projectTitle: "Unknown project",
      status: "unknown",
    });
  });
});
