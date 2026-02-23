import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { fetchDashboardSummary } from "@/lib/dashboard/data";
import { t } from "@/lib/i18n";
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
        {t(locale, "dashboard.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "dashboard.signedInAs")}{" "}
        {access.user.email ?? access.user.id}
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.activeInvestments")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {summary.activeInvestments}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.totalInvested")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{summary.totalInvested.toFixed(2)}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.totalReturned")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{summary.totalReturned.toFixed(2)}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.netExposure")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{summary.netExposure.toFixed(2)}
          </p>
        </article>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/${locale}/dashboard/portfolio`}
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold tracking-[0.08em] text-accent-foreground uppercase transition hover:translate-y-[-1px] hover:bg-[#174f3d]"
        >
          {t(locale, "dashboard.viewPortfolio")}
        </Link>
        <Link
          href={`/${locale}/dashboard/wallet`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/80 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
        >
          {t(locale, "dashboard.viewWallet")}
        </Link>
        <Link
          href={`/${locale}/dashboard/documents`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/80 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
        >
          {t(locale, "dashboard.viewDocuments")}
        </Link>
        <Link
          href={`/${locale}/dashboard/investments`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/80 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
        >
          {t(locale, "dashboard.viewInvestments")}
        </Link>
        <Link
          href={`/${locale}/dashboard/settings`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/80 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
        >
          {t(locale, "dashboard.viewSettings")}
        </Link>
        <Link
          href={`/${locale}/dashboard/progress`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/80 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
        >
          {t(locale, "dashboard.viewProgress")}
        </Link>
        <Link
          href={`/${locale}/dashboard/kyc`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/80 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
        >
          {t(locale, "dashboard.viewKyc")}
        </Link>
        <Link
          href={`/${locale}/dashboard/favorites`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/80 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
        >
          {t(locale, "dashboard.viewFavorites")}
        </Link>
        <Link
          href={`/${locale}/dashboard/notifications`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/80 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
        >
          {t(locale, "dashboard.viewNotifications")}
        </Link>
        <Link
          href={`/${locale}/dashboard/distributions`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/80 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
        >
          {t(locale, "dashboard.viewDistributions")}
        </Link>
        <Link
          href={`/${locale}/dashboard/transactions`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/80 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
        >
          {t(locale, "dashboard.viewTransactions")}
        </Link>
        <Link
          href={`/${locale}/dashboard/projects`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/80 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
        >
          {t(locale, "dashboard.viewProjects")}
        </Link>
        <Link
          href={`/${locale}/dashboard/statements`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/80 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
        >
          {t(locale, "dashboard.viewStatements")}
        </Link>
      </div>
    </main>
  );
}
