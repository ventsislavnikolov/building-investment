import Link from "next/link";
import { notFound } from "next/navigation";
import { t } from "@/lib/i18n";
import { getProjectBySlug } from "@/lib/projects/catalog";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";

type ProjectDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;
  const project = getProjectBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-8 py-20">
      <Link
        href={`/${locale}/projects`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {t(locale, "projects.title")}
      </Link>
      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {project.title}
      </h1>
      <p className="mt-3 text-lg text-muted">{project.city}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "projects.card.strategy")}
          </p>
          <p className="mt-2 font-semibold text-foreground">
            {t(locale, `projects.strategy.${project.strategy}`)}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">{t(locale, "projects.card.irr")}</p>
          <p className="mt-2 font-semibold text-foreground">
            {project.expectedIrrPct.toFixed(1)}%
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
          <p className="text-sm text-muted">
            {t(locale, "projects.card.funded")}
          </p>
          <p className="mt-2 font-semibold text-foreground">
            {project.fundedPct}%
          </p>
        </article>
      </div>
    </main>
  );
}
