import { buildWalletSnapshot } from "@/lib/dashboard/wallet";

describe("dashboard wallet", () => {
  it("computes wallet exposure and return yield from summary totals", () => {
    const wallet = buildWalletSnapshot({
      totalInvested: 2000,
      totalReturned: 500,
    });

    expect(wallet.committedCapital).toBe(2000);
    expect(wallet.realizedReturns).toBe(500);
    expect(wallet.netExposure).toBe(1500);
    expect(wallet.returnYieldPct).toBe(25);
  });

  it("returns zero yield when no invested capital exists", () => {
    const wallet = buildWalletSnapshot({
      totalInvested: 0,
      totalReturned: 250,
    });

    expect(wallet.returnYieldPct).toBe(0);
  });
});
