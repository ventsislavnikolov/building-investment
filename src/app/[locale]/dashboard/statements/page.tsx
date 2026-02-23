import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type StatementsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function StatementsPage({ params }: StatementsPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/dashboard/statements`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-20">
      <Link
        href={`/${locale}/dashboard`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {t(locale, "dashboard.title")}
      </Link>
      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "dashboard.statements.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "dashboard.statements.subtitle")}
      </p>
      <section className="mt-8 rounded-2xl border border-foreground/10 bg-white/70 p-6">
        <p className="text-sm text-muted">
          {t(locale, "dashboard.statements.empty")}
        </p>
      </section>
    </main>
  );
}
