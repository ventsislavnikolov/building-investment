import Link from "next/link";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <main className="relative mx-auto min-h-screen max-w-5xl overflow-hidden px-8 py-20">
      <div className="pointer-events-none absolute top-[-4rem] right-[-5rem] h-56 w-56 rounded-full bg-accent/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-3rem] left-[-4rem] h-48 w-48 rounded-full bg-[#9f4f28]/12 blur-3xl" />

      <h1 className="font-[var(--font-display)] text-5xl text-foreground sm:text-6xl">
        {t(locale, "about.title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        {t(locale, "about.subtitle")}
      </p>

      <section className="mt-10 grid gap-4">
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-6 shadow-[0_10px_25px_rgba(31,45,42,0.08)] backdrop-blur-sm">
          <p className="leading-relaxed text-foreground">
            {t(locale, "about.p1")}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-6 shadow-[0_10px_25px_rgba(31,45,42,0.08)] backdrop-blur-sm">
          <p className="leading-relaxed text-foreground">
            {t(locale, "about.p2")}
          </p>
        </article>
        <article className="rounded-2xl border border-foreground/10 bg-white/70 p-6 shadow-[0_10px_25px_rgba(31,45,42,0.08)] backdrop-blur-sm">
          <p className="leading-relaxed text-foreground">
            {t(locale, "about.p3")}
          </p>
        </article>
      </section>

      <div className="mt-10">
        <Link
          href={`/${locale}/projects`}
          className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold tracking-[0.08em] text-accent-foreground uppercase transition hover:translate-y-[-1px] hover:bg-[#174f3d]"
        >
          {t(locale, "home.cta.projects")}
        </Link>
      </div>
    </main>
  );
}
