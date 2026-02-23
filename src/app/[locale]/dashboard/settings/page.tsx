import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { fetchDashboardProfile } from "@/lib/dashboard/data";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SettingsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/dashboard/settings`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  const profile = await fetchDashboardProfile(supabase, access.user.id);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-20">
      <Link
        href={`/${locale}/dashboard`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {t(locale, "dashboard.title")}
      </Link>

      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "dashboard.settings.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "dashboard.settings.subtitle")}
      </p>

      <section className="mt-8 grid gap-4 rounded-2xl border border-foreground/10 bg-white/70 p-6 sm:grid-cols-2">
        <article className="rounded-xl border border-foreground/10 bg-surface/80 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.settings.name")}
          </p>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {profile.fullName}
          </p>
        </article>
        <article className="rounded-xl border border-foreground/10 bg-surface/80 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.settings.email")}
          </p>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {profile.email}
          </p>
        </article>
        <article className="rounded-xl border border-foreground/10 bg-surface/80 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.settings.locale")}
          </p>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {profile.locale.toUpperCase()}
          </p>
        </article>
        <article className="rounded-xl border border-foreground/10 bg-surface/80 p-4">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.settings.currency")}
          </p>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {profile.currency}
          </p>
        </article>
        <article className="rounded-xl border border-foreground/10 bg-surface/80 p-4 sm:col-span-2">
          <p className="text-sm text-muted">
            {t(locale, "dashboard.settings.kycStatus")}
          </p>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {profile.kycStatus}
          </p>
        </article>
      </section>
    </main>
  );
}
