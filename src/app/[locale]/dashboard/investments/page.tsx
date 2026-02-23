import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { fetchDashboardInvestments } from "@/lib/dashboard/data";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type InvestmentsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function InvestmentsPage({
  params,
}: InvestmentsPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/dashboard/investments`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  const investments = await fetchDashboardInvestments(
    supabase,
    access.user.id,
    locale,
  );

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-20">
      <Link
        href={`/${locale}/dashboard`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {t(locale, "dashboard.title")}
      </Link>

      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "dashboard.investments.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "dashboard.investments.subtitle")}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.investments.openCommitments")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {investments.openCommitments}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.investments.totalCommitted")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{investments.totalCommitted.toFixed(2)}
          </p>
        </article>
      </div>

      {investments.items.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          {t(locale, "dashboard.investments.empty")}
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {investments.items.map((investment) => (
            <li
              key={investment.id}
              className="grid gap-4 rounded-xl border border-foreground/10 bg-white/70 p-4 sm:grid-cols-[1fr_auto_auto]"
            >
              <div>
                <p className="font-semibold text-foreground">
                  {investment.projectTitle}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {investment.createdAt
                    ? new Date(investment.createdAt).toLocaleDateString(locale)
                    : "-"}
                </p>
              </div>
              <p className="text-sm text-muted">{investment.status}</p>
              <p className="text-right font-semibold text-foreground">
                €{investment.amount.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
