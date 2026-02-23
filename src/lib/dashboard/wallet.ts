export type WalletSnapshot = {
  committedCapital: number;
  netExposure: number;
  realizedReturns: number;
  returnYieldPct: number;
};

export function buildWalletSnapshot(input: {
  totalInvested: number;
  totalReturned: number;
}): WalletSnapshot {
  const committedCapital = input.totalInvested;
  const realizedReturns = input.totalReturned;
  const netExposure = committedCapital - realizedReturns;
  const returnYieldPct =
    committedCapital > 0 ? (realizedReturns / committedCapital) * 100 : 0;

  return {
    committedCapital,
    realizedReturns,
    netExposure,
    returnYieldPct,
  };
}
