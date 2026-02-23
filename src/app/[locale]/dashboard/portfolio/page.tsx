import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { fetchDashboardPortfolio } from "@/lib/dashboard/data";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PortfolioPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/dashboard/portfolio`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  const portfolio = await fetchDashboardPortfolio(
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
        {t(locale, "dashboard.portfolio.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "dashboard.portfolio.subtitle")}
      </p>

      <section className="mt-8 rounded-2xl border border-foreground/10 bg-white/70 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-foreground/10 bg-surface/80 p-4">
            <p className="text-sm text-muted">
              {t(locale, "dashboard.portfolio.positions")}
            </p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {portfolio.activePositions}
            </p>
          </article>
          <article className="rounded-xl border border-foreground/10 bg-surface/80 p-4">
            <p className="text-sm text-muted">
              {t(locale, "dashboard.portfolio.totalInvested")}
            </p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              €{portfolio.totalInvested.toFixed(2)}
            </p>
          </article>
        </div>

        {portfolio.items.length === 0 ? (
          <p className="mt-6 text-sm text-muted">
            {t(locale, "dashboard.portfolio.empty")}
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {portfolio.items.map((item) => (
              <li
                key={item.id}
                className="grid gap-4 rounded-xl border border-foreground/10 bg-white p-4 sm:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  {item.projectSlug ? (
                    <Link
                      href={`/${locale}/dashboard/projects/${item.projectSlug}`}
                      className="font-semibold text-foreground transition hover:text-accent"
                    >
                      {item.projectTitle || item.projectId}
                    </Link>
                  ) : (
                    <p className="font-semibold text-foreground">
                      {item.projectTitle || item.projectId}
                    </p>
                  )}
                  <p className="text-sm text-muted">{item.city}</p>
                </div>
                <p className="text-sm text-muted">{item.status}</p>
                <p className="text-right font-semibold text-foreground">
                  €{item.amount.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
