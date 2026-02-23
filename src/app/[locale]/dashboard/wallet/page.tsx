import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { fetchDashboardSummary } from "@/lib/dashboard/data";
import { buildWalletSnapshot } from "@/lib/dashboard/wallet";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type WalletPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function WalletPage({ params }: WalletPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/dashboard/wallet`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  const summary = await fetchDashboardSummary(supabase, access.user.id);
  const wallet = buildWalletSnapshot({
    totalInvested: summary.totalInvested,
    totalReturned: summary.totalReturned,
  });

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-20">
      <Link
        href={`/${locale}/dashboard`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {t(locale, "dashboard.title")}
      </Link>

      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "dashboard.wallet.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "dashboard.wallet.subtitle")}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.wallet.committed")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{wallet.committedCapital.toFixed(2)}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.wallet.returns")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{wallet.realizedReturns.toFixed(2)}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.wallet.netExposure")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{wallet.netExposure.toFixed(2)}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.wallet.yield")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {wallet.returnYieldPct.toFixed(1)}%
          </p>
        </article>
      </div>
    </main>
  );
}
