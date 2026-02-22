import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { fetchDashboardSummary } from "@/lib/dashboard/data";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(locale, data.user);

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  const summary = await fetchDashboardSummary(supabase, access.user.id);

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-8 py-20">
      <h1 className="font-[var(--font-display)] text-5xl text-foreground">
        Dashboard
      </h1>
      <p className="mt-4 text-lg text-muted">
        Signed in as {access.user.email ?? access.user.id}
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">Active Investments</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {summary.activeInvestments}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">Total Invested</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{summary.totalInvested.toFixed(2)}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">Total Returned</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{summary.totalReturned.toFixed(2)}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">Net Exposure</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{summary.netExposure.toFixed(2)}
          </p>
        </article>
      </div>
    </main>
  );
}
