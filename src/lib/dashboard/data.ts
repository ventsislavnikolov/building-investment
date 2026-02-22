import type { SupabaseClient } from "@supabase/supabase-js";
import { buildDashboardSummary } from "@/lib/dashboard/summary";

type InvestmentRow = {
  amount: number | null;
  status: string | null;
};

type DistributionRow = {
  net_amount: number | null;
};

export async function fetchDashboardSummary(
  supabase: SupabaseClient,
  investorId: string,
) {
  const [{ data: investments }, { data: distributions }] = await Promise.all([
    supabase
      .from("investments")
      .select("amount,status")
      .eq("investor_id", investorId),
    supabase
      .from("distributions")
      .select("net_amount")
      .eq("investor_id", investorId),
  ]);

  return buildDashboardSummary({
    investments: (investments ?? []).map((item: InvestmentRow) => ({
      amount: Number(item.amount ?? 0),
      status: item.status ?? "",
    })),
    distributions: (distributions ?? []).map((item: DistributionRow) => ({
      netAmount: Number(item.net_amount ?? 0),
    })),
  });
}
