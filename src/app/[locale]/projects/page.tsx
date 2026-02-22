import Link from "next/link";
import { t } from "@/lib/i18n";
import {
  type CatalogSort,
  type CatalogStrategyFilter,
  getProjectCatalog,
  isCatalogSort,
  isCatalogStrategyFilter,
  projectStrategies,
} from "@/lib/projects/catalog";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";

type ProjectsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; sort?: string; strategy?: string }>;
};

export default async function ProjectsPage({
  params,
  searchParams,
}: ProjectsPageProps) {
  const { locale: rawLocale } = await params;
  const { q = "", sort = "featured", strategy = "all" } = await searchParams;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;
  const strategyFilter: CatalogStrategyFilter = isCatalogStrategyFilter(
    strategy,
  )
    ? strategy
    : "all";
  const sortFilter: CatalogSort = isCatalogSort(sort) ? sort : "featured";
  const catalog = getProjectCatalog({
    locale,
    strategy: strategyFilter,
    search: q,
    sort: sortFilter,
  });

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-8 py-20">
      <h1 className="font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "projects.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "projects.subtitle")}
      </p>

      <form className="mt-8 grid gap-3 rounded-2xl border border-foreground/10 bg-white/60 p-4 sm:grid-cols-[1fr_auto]">
        <input
          defaultValue={q}
          name="q"
          className="w-full rounded-xl border border-foreground/20 bg-white px-4 py-3 text-foreground outline-none ring-accent transition focus:ring-2"
          placeholder={t(locale, "projects.searchPlaceholder")}
        />
        <div className="flex gap-2 sm:justify-end">
          <select
            name="strategy"
            defaultValue={strategyFilter}
            className="rounded-xl border border-foreground/20 bg-white px-3 py-3 text-sm text-foreground outline-none ring-accent transition focus:ring-2"
          >
            <option value="all">{t(locale, "projects.strategy.all")}</option>
            {projectStrategies.map((value) => (
              <option key={value} value={value}>
                {t(locale, `projects.strategy.${value}`)}
              </option>
            ))}
          </select>
          <select
            name="sort"
            defaultValue={sortFilter}
            className="rounded-xl border border-foreground/20 bg-white px-3 py-3 text-sm text-foreground outline-none ring-accent transition focus:ring-2"
          >
            <option value="featured">
              {t(locale, "projects.sort.featured")}
            </option>
            <option value="funded_desc">
              {t(locale, "projects.sort.funded")}
            </option>
            <option value="irr_desc">{t(locale, "projects.sort.irr")}</option>
          </select>
          <button
            type="submit"
            className="rounded-xl bg-accent px-4 py-3 text-xs font-semibold tracking-[0.08em] text-accent-foreground uppercase"
          >
            OK
          </button>
        </div>
      </form>

      {catalog.total === 0 ? (
        <p className="mt-10 text-muted">{t(locale, "projects.empty")}</p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {catalog.items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-foreground/10 bg-white/70 p-5"
            >
              <h2 className="font-[var(--font-display)] text-2xl text-foreground">
                <Link
                  href={`/${locale}/projects/${item.slug}`}
                  className="transition hover:text-accent"
                >
                  {item.title}
                </Link>
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted">
                    {t(locale, "projects.card.city")}
                  </dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    {item.city}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">
                    {t(locale, "projects.card.strategy")}
                  </dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    {t(locale, `projects.strategy.${item.strategy}`)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">
                    {t(locale, "projects.card.irr")}
                  </dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    {item.expectedIrrPct.toFixed(1)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">
                    {t(locale, "projects.card.funded")}
                  </dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    {item.fundedPct}%
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
