import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { InvestForm } from "@/components/investments/invest-form";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { t } from "@/lib/i18n";
import { getProjectBySlug } from "@/lib/projects/catalog";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProjectInvestPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProjectInvestPage({
  params,
}: ProjectInvestPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;
  const project = getProjectBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/projects/${slug}/invest`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-8 py-20">
      <Link
        href={`/${locale}/projects/${project.slug}`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {project.title}
      </Link>
      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "projects.invest.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "projects.invest.subtitle")}
      </p>
      <InvestForm
        locale={locale}
        slug={project.slug}
        minAmount={project.minInvestment}
        maxAmount={project.maxInvestment}
      />
    </main>
  );
}
