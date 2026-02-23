import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateAdminAccess } from "@/lib/auth/admin-access";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminMetricsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminMetricsPage({
  params,
}: AdminMetricsPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  const profileLookup = data.user
    ? await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle()
    : null;

  const access = evaluateAdminAccess(
    locale,
    data.user
      ? {
          id: data.user.id,
          role: profileLookup?.data?.role ?? "investor",
        }
      : null,
    `/${locale}/admin/metrics`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-20">
      <h1 className="font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "admin.metrics.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "admin.metrics.subtitle")}
      </p>
      <section className="mt-8 rounded-2xl border border-foreground/10 bg-white/70 p-6">
        <p className="text-sm text-muted">{t(locale, "admin.scope")}</p>
        <p className="mt-2 text-xl font-semibold text-foreground">
          {access.user.role}
        </p>
        <p className="mt-6 text-sm text-muted">
          {t(locale, "admin.metrics.placeholder")}
        </p>
      </section>
      <div className="mt-8">
        <Link
          href={`/${locale}/admin/dashboard`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 bg-surface/80 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-white/70"
        >
          {t(locale, "admin.metrics.back")}
        </Link>
      </div>
    </main>
  );
}
