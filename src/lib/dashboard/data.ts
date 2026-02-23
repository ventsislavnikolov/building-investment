import type { SupabaseClient } from "@supabase/supabase-js";
import { buildPortfolioPositions } from "@/lib/dashboard/portfolio";
import { buildDashboardSummary } from "@/lib/dashboard/summary";
import type { AppLocale } from "@/lib/routing";

type InvestmentRow = {
  amount: number | null;
  status: string | null;
};

type DistributionRow = {
  net_amount: number | null;
};

type PortfolioInvestmentRow = {
  amount: number | null;
  id: string | null;
  project_id: string | null;
  status: string | null;
  projects:
    | {
        city: string | null;
        title_bg: string | null;
        title_en: string | null;
      }
    | null
    | {
        city: string | null;
        title_bg: string | null;
        title_en: string | null;
      }[];
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

export async function fetchDashboardPortfolio(
  supabase: SupabaseClient,
  investorId: string,
  locale: AppLocale,
) {
  const { data } = await supabase
    .from("investments")
    .select("id,amount,status,project_id,projects(title_bg,title_en,city)")
    .eq("investor_id", investorId);

  return buildPortfolioPositions({
    investments: (data ?? []).map((item: PortfolioInvestmentRow) => {
      const relatedProject = Array.isArray(item.projects)
        ? item.projects[0]
        : item.projects;

      return {
        amount: Number(item.amount ?? 0),
        city: relatedProject?.city ?? "",
        id: item.id ?? "",
        projectId: item.project_id ?? "",
        projectTitle:
          locale === "bg"
            ? (relatedProject?.title_bg ?? relatedProject?.title_en ?? "")
            : (relatedProject?.title_en ?? relatedProject?.title_bg ?? ""),
        status: item.status ?? "",
      };
    }),
  });
}
