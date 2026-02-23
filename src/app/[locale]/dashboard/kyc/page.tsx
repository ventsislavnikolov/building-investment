import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { fetchDashboardKycStatus } from "@/lib/dashboard/data";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type KycPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function KycPage({ params }: KycPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/dashboard/kyc`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  const kyc = await fetchDashboardKycStatus(supabase, access.user.id);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-20">
      <Link
        href={`/${locale}/dashboard`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {t(locale, "dashboard.title")}
      </Link>

      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "dashboard.kyc.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "dashboard.kyc.subtitle")}
      </p>

      <section className="mt-8 rounded-2xl border border-foreground/10 bg-white/70 p-6">
        <p className="text-sm text-muted">
          {t(locale, "dashboard.kyc.statusLabel")}
        </p>
        <p className="mt-2 text-3xl font-semibold text-foreground">
          {kyc.status}
        </p>
        <p className="mt-4 text-sm text-muted">
          {kyc.isComplete
            ? t(locale, "dashboard.kyc.complete")
            : t(locale, "dashboard.kyc.incomplete")}
        </p>
        <p className="mt-2 text-sm text-muted">
          {t(locale, "dashboard.kyc.actionLabel")}: {kyc.action}
        </p>
        {kyc.verifiedAt ? (
          <p className="mt-2 text-sm text-muted">
            {t(locale, "dashboard.kyc.verifiedAt")}:{" "}
            {new Date(kyc.verifiedAt).toLocaleDateString(locale)}
          </p>
        ) : null}
      </section>
    </main>
  );
}
