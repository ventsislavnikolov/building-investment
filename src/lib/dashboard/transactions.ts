type DashboardTransactionInput = {
  amount: number;
  createdAt: string;
  id: string;
  kind: "credit" | "debit";
  label: string;
  source: string;
};

export type DashboardTransaction = {
  amount: number;
  createdAt: string;
  id: string;
  kind: "credit" | "debit";
  label: string;
  source: string;
};

export type DashboardTransactions = {
  items: DashboardTransaction[];
  totalCredits: number;
  totalDebits: number;
};

export function buildDashboardTransactions(input: {
  transactions: DashboardTransactionInput[];
}): DashboardTransactions {
  const items = input.transactions
    .map((transaction) => ({
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      id: transaction.id || "unknown-transaction",
      kind: transaction.kind,
      label: transaction.label || "Transaction",
      source: transaction.source || "unknown",
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    );

  return {
    items,
    totalCredits: items
      .filter((item) => item.kind === "credit")
      .reduce((sum, item) => sum + item.amount, 0),
    totalDebits: items
      .filter((item) => item.kind === "debit")
      .reduce((sum, item) => sum + item.amount, 0),
  };
}
