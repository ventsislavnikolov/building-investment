import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type NotificationsPageProps = {
  params: Promise<{ locale: string }>;
};

type NotificationRow = {
  created_at?: string | null;
  id?: string | null;
  is_read?: boolean | null;
  message?: string | null;
  title?: string | null;
};

export default async function NotificationsPage({
  params,
}: NotificationsPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/dashboard/notifications`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("profile_id", access.user.id)
    .order("created_at", { ascending: false })
    .limit(25);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-20">
      <Link
        href={`/${locale}/dashboard`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {t(locale, "dashboard.title")}
      </Link>

      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "dashboard.notifications.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "dashboard.notifications.subtitle")}
      </p>

      {(notifications ?? []).length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          {t(locale, "dashboard.notifications.empty")}
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {(notifications ?? []).map((notification: NotificationRow) => (
            <li
              key={notification.id ?? "notification"}
              className="rounded-xl border border-foreground/10 bg-white/70 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-foreground">
                  {notification.title ??
                    t(locale, "dashboard.notifications.item")}
                </p>
                <p className="text-xs uppercase tracking-[0.08em] text-muted">
                  {notification.is_read
                    ? t(locale, "dashboard.notifications.read")
                    : t(locale, "dashboard.notifications.unread")}
                </p>
              </div>
              <p className="mt-2 text-sm text-muted">
                {notification.message ?? ""}
              </p>
              <p className="mt-3 text-xs text-muted">
                {notification.created_at
                  ? new Date(notification.created_at).toLocaleDateString(locale)
                  : "-"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
