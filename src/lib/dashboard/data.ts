import type { SupabaseClient } from "@supabase/supabase-js";
import { buildDashboardDocuments } from "@/lib/dashboard/documents";
import { buildDashboardInvestments } from "@/lib/dashboard/investments";
import { buildPortfolioPositions } from "@/lib/dashboard/portfolio";
import { buildDashboardProfile } from "@/lib/dashboard/profile";
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

type DashboardDocumentRow = {
  category: string | null;
  created_at: string | null;
  file_name: string | null;
  file_path: string | null;
  id: string | null;
  title: string | null;
};

type DashboardInvestmentRow = {
  amount: number | null;
  created_at: string | null;
  id: string | null;
  status: string | null;
  projects:
    | {
        title_bg: string | null;
        title_en: string | null;
      }
    | null
    | {
        title_bg: string | null;
        title_en: string | null;
      }[];
};

type DashboardProfileRow = {
  currency: string | null;
  email: string | null;
  first_name: string | null;
  kyc_status: string | null;
  last_name: string | null;
  locale: string | null;
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

export async function fetchDashboardDocuments(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("documents")
    .select("id,title,category,file_name,file_path,created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  return buildDashboardDocuments({
    documents: (data ?? []).map((item: DashboardDocumentRow) => ({
      category: item.category ?? "",
      createdAt: item.created_at ?? "",
      fileName: item.file_name ?? "",
      filePath: item.file_path ?? "",
      id: item.id ?? "",
      title: item.title ?? "",
    })),
  });
}

export async function fetchDashboardInvestments(
  supabase: SupabaseClient,
  investorId: string,
  locale: AppLocale,
) {
  const { data } = await supabase
    .from("investments")
    .select("id,amount,status,created_at,projects(title_bg,title_en)")
    .eq("investor_id", investorId);

  return buildDashboardInvestments({
    investments: (data ?? []).map((item: DashboardInvestmentRow) => {
      const relatedProject = Array.isArray(item.projects)
        ? item.projects[0]
        : item.projects;

      return {
        amount: Number(item.amount ?? 0),
        createdAt: item.created_at ?? "",
        id: item.id ?? "",
        projectTitle:
          locale === "bg"
            ? (relatedProject?.title_bg ?? relatedProject?.title_en ?? "")
            : (relatedProject?.title_en ?? relatedProject?.title_bg ?? ""),
        status: item.status ?? "",
      };
    }),
  });
}

export async function fetchDashboardProfile(
  supabase: SupabaseClient,
  investorId: string,
) {
  const { data } = await supabase
    .from("profiles")
    .select("first_name,last_name,email,kyc_status,locale,currency")
    .eq("id", investorId)
    .maybeSingle();

  const profile = (data ?? {}) as DashboardProfileRow;

  return buildDashboardProfile({
    currency: profile.currency ?? "",
    email: profile.email ?? "",
    firstName: profile.first_name ?? "",
    kycStatus: profile.kyc_status ?? "",
    lastName: profile.last_name ?? "",
    locale: profile.locale ?? "",
  });
}
