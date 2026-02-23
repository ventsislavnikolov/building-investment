import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { fetchDashboardDocuments } from "@/lib/dashboard/data";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DocumentsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DocumentsPage({ params }: DocumentsPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/dashboard/documents`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  const documents = await fetchDashboardDocuments(supabase);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-20">
      <Link
        href={`/${locale}/dashboard`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {t(locale, "dashboard.title")}
      </Link>

      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "dashboard.documents.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "dashboard.documents.subtitle")}
      </p>

      {documents.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          {t(locale, "dashboard.documents.empty")}
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {documents.map((document) => (
            <li
              key={document.id}
              className="grid gap-4 rounded-xl border border-foreground/10 bg-white/70 p-4 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-semibold text-foreground">
                  {document.title}
                </p>
                <p className="mt-1 text-sm text-muted">{document.fileName}</p>
              </div>
              <div className="text-right text-sm text-muted">
                <p className="uppercase">{document.category}</p>
                <p className="mt-1">
                  {document.createdAt
                    ? new Date(document.createdAt).toLocaleDateString(locale)
                    : "-"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
