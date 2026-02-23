import Link from "next/link";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";

type HowItWorksPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HowItWorksPage({ params }: HowItWorksPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const steps = [
    {
      title: t(locale, "how.step1.title"),
      body: t(locale, "how.step1.body"),
    },
    {
      title: t(locale, "how.step2.title"),
      body: t(locale, "how.step2.body"),
    },
    {
      title: t(locale, "how.step3.title"),
      body: t(locale, "how.step3.body"),
    },
    {
      title: t(locale, "how.step4.title"),
      body: t(locale, "how.step4.body"),
    },
  ];

  return (
    <main className="relative mx-auto min-h-screen max-w-5xl overflow-hidden px-8 py-20">
      <div className="pointer-events-none absolute top-[-5rem] right-[-6rem] h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-4rem] left-[-5rem] h-56 w-56 rounded-full bg-[#9f4f28]/10 blur-3xl" />

      <h1 className="font-[var(--font-display)] text-5xl text-foreground sm:text-6xl">
        {t(locale, "how.title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        {t(locale, "how.subtitle")}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {steps.map((step) => (
          <article
            key={step.title}
            className="rounded-2xl border border-foreground/10 bg-white/70 p-6 shadow-[0_10px_25px_rgba(31,45,42,0.08)] backdrop-blur-sm"
          >
            <h2 className="font-[var(--font-display)] text-2xl text-foreground">
              {step.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {step.body}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href={`/${locale}/projects`}
          className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold tracking-[0.08em] text-accent-foreground uppercase transition hover:translate-y-[-1px] hover:bg-[#174f3d]"
        >
          {t(locale, "how.cta")}
        </Link>
      </div>
    </main>
  );
}
