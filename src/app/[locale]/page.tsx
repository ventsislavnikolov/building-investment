import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_15%,#fff8dc_0,#f3efe4_45%),linear-gradient(135deg,#f3efe4_0,#ebdfc8_100%)]">
      <div className="absolute top-[-9rem] right-[-8rem] h-80 w-80 rounded-full bg-accent/12 blur-3xl" />
      <div className="absolute bottom-[-6rem] left-[-7rem] h-72 w-72 rounded-full bg-[#9f4f28]/12 blur-3xl" />
      <main className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-12 px-8 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-12">
        <section className="space-y-8">
          <p className="w-fit rounded-full border border-foreground/15 bg-surface/70 px-4 py-2 text-sm tracking-[0.18em] text-muted uppercase">
            {t(locale, "home.badge")}
          </p>
          <h1 className="font-[var(--font-display)] text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {t(locale, "home.headline")}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">
            {t(locale, "home.description")}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold tracking-[0.08em] text-accent-foreground uppercase transition hover:translate-y-[-1px] hover:bg-[#174f3d]"
              href={`/${locale}/projects`}
            >
              {t(locale, "home.cta.projects")}
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/70 px-7 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
              href={`/${locale}/how-it-works`}
            >
              {t(locale, "home.cta.how")}
            </a>
          </div>
        </section>
        <section className="rounded-3xl border border-foreground/10 bg-surface/80 p-7 shadow-[0_24px_64px_rgba(31,45,42,0.12)] backdrop-blur-sm">
          <h2 className="font-[var(--font-display)] text-2xl text-foreground">
            {t(locale, "home.snapshot")}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
              <p className="text-sm text-muted">
                {t(locale, "home.snapshot.openProjects")}
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">6</p>
            </article>
            <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
              <p className="text-sm text-muted">
                {t(locale, "home.snapshot.avgIrr")}
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                11.8%
              </p>
            </article>
            <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
              <p className="text-sm text-muted">
                {t(locale, "home.snapshot.investors")}
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">412</p>
            </article>
            <article className="rounded-2xl border border-foreground/10 bg-white/70 p-4">
              <p className="text-sm text-muted">
                {t(locale, "home.snapshot.distributed")}
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                €1.3M
              </p>
            </article>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            {t(locale, "home.snapshot.note")}
          </p>
        </section>
      </main>
    </div>
  );
}
