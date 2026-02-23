import { buildDashboardTransactions } from "@/lib/dashboard/transactions";

describe("dashboard transactions", () => {
  it("sorts transactions newest-first and computes credit/debit totals", () => {
    const result = buildDashboardTransactions({
      transactions: [
        {
          amount: 900,
          createdAt: "2025-02-11T08:00:00.000Z",
          id: "tx-1",
          kind: "debit",
          label: "Investment / Sofia Apartment",
          source: "investment",
        },
        {
          amount: 120,
          createdAt: "2025-02-18T08:00:00.000Z",
          id: "tx-2",
          kind: "credit",
          label: "Distribution / Sofia Apartment",
          source: "distribution",
        },
      ],
    });

    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe("tx-2");
    expect(result.items[1].id).toBe("tx-1");
    expect(result.totalCredits).toBe(120);
    expect(result.totalDebits).toBe(900);
  });

  it("falls back to safe defaults when values are missing", () => {
    const result = buildDashboardTransactions({
      transactions: [
        {
          amount: 0,
          createdAt: "",
          id: "",
          kind: "debit",
          label: "",
          source: "",
        },
      ],
    });

    expect(result.items[0]).toMatchObject({
      id: "unknown-transaction",
      label: "Transaction",
      source: "unknown",
    });
  });
});
