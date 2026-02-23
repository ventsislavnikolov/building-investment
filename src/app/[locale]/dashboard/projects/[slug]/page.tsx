import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { fetchDashboardProjectExposure } from "@/lib/dashboard/data";
import { t } from "@/lib/i18n";
import { getProjectBySlug } from "@/lib/projects/catalog";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DashboardProjectDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function DashboardProjectDetailPage({
  params,
}: DashboardProjectDetailPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/dashboard/projects/${slug}`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  const project = getProjectBySlug(slug, locale);
  if (!project) {
    notFound();
  }

  const exposure = await fetchDashboardProjectExposure(supabase, {
    investorId: access.user.id,
    slug,
  });

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-20">
      <Link
        href={`/${locale}/dashboard/portfolio`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {t(locale, "dashboard.portfolio.title")}
      </Link>

      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {project.title}
      </h1>
      <p className="mt-3 text-lg text-muted">{project.city}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.project.committed")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{exposure.committedCapital.toFixed(2)}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.project.returned")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{exposure.returnedCapital.toFixed(2)}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.project.outstanding")}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            €{exposure.outstandingCapital.toFixed(2)}
          </p>
        </article>
      </div>
    </main>
  );
}
