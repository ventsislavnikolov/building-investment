import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type FavoritesPageProps = {
  params: Promise<{ locale: string }>;
};

type FavoriteRow = {
  id: string | null;
  projects:
    | {
        city: string | null;
        slug: string | null;
        title_bg: string | null;
        title_en: string | null;
      }
    | null
    | {
        city: string | null;
        slug: string | null;
        title_bg: string | null;
        title_en: string | null;
      }[];
};

export default async function FavoritesPage({ params }: FavoritesPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/dashboard/favorites`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  const { data: favorites } = await supabase
    .from("favorites")
    .select("id,projects(slug,title_bg,title_en,city)")
    .eq("investor_id", access.user.id);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-20">
      <Link
        href={`/${locale}/dashboard`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {t(locale, "dashboard.title")}
      </Link>

      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "dashboard.favorites.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "dashboard.favorites.subtitle")}
      </p>

      {(favorites ?? []).length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          {t(locale, "dashboard.favorites.empty")}
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {(favorites ?? []).map((favorite: FavoriteRow) => {
            const project = Array.isArray(favorite.projects)
              ? favorite.projects[0]
              : favorite.projects;

            const projectTitle =
              locale === "bg"
                ? (project?.title_bg ?? project?.title_en ?? "")
                : (project?.title_en ?? project?.title_bg ?? "");

            return (
              <li
                key={favorite.id ?? `${project?.slug ?? ""}-favorite`}
                className="grid gap-4 rounded-xl border border-foreground/10 bg-white/70 p-4 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {projectTitle}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {project?.city ?? ""}
                  </p>
                </div>
                <Link
                  href={`/${locale}/projects/${project?.slug ?? ""}`}
                  className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
                >
                  {t(locale, "projects.invest.cta")}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
