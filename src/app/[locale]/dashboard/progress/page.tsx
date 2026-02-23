import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { fetchDashboardProgress } from "@/lib/dashboard/data";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProgressPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProgressPage({ params }: ProgressPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/dashboard/progress`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  const updates = await fetchDashboardProgress(supabase, locale);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-20">
      <Link
        href={`/${locale}/dashboard`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {t(locale, "dashboard.title")}
      </Link>

      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "dashboard.progress.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "dashboard.progress.subtitle")}
      </p>

      {updates.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          {t(locale, "dashboard.progress.empty")}
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {updates.map((update) => (
            <li
              key={update.id}
              className="grid gap-4 rounded-xl border border-foreground/10 bg-white/70 p-4 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-semibold text-foreground">{update.title}</p>
                <p className="mt-1 text-sm text-muted">{update.projectTitle}</p>
                <p className="mt-1 text-xs text-muted">
                  {update.publishedAt
                    ? new Date(update.publishedAt).toLocaleDateString(locale)
                    : "-"}
                </p>
              </div>
              <div className="text-right text-sm text-muted">
                <p>{update.timelineStatus}</p>
                <p>{update.budgetStatus}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
