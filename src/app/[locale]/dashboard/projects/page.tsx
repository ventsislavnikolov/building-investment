import Link from "next/link";
import { redirect } from "next/navigation";
import { evaluateDashboardAccess } from "@/lib/auth/session";
import { t } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/routing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DashboardProjectsPageProps = {
  params: Promise<{ locale: string }>;
};

type DashboardProjectRow = {
  project_id: string | null;
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

export default async function DashboardProjectsPage({
  params,
}: DashboardProjectsPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isSupportedLocale(rawLocale) ? rawLocale : defaultLocale;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const access = evaluateDashboardAccess(
    locale,
    data.user,
    `/${locale}/dashboard/projects`,
  );

  if (!access.ok) {
    redirect(access.redirectTo);
  }

  const { data: projectRows } = await supabase
    .from("investments")
    .select("project_id,projects(slug,title_bg,title_en,city)")
    .eq("investor_id", access.user.id);

  const uniqueProjects = new Map<
    string,
    { city: string; slug: string; title: string }
  >();

  for (const row of (projectRows ?? []) as DashboardProjectRow[]) {
    const project = Array.isArray(row.projects)
      ? row.projects[0]
      : row.projects;
    const projectId = row.project_id ?? "";
    if (!projectId || !project?.slug) {
      continue;
    }

    uniqueProjects.set(projectId, {
      city: project.city ?? "",
      slug: project.slug,
      title:
        locale === "bg"
          ? (project.title_bg ?? project.title_en ?? "")
          : (project.title_en ?? project.title_bg ?? ""),
    });
  }

  const projects = Array.from(uniqueProjects.values());

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-20">
      <Link
        href={`/${locale}/dashboard`}
        className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
      >
        ← {t(locale, "dashboard.title")}
      </Link>
      <h1 className="mt-6 font-[var(--font-display)] text-5xl text-foreground">
        {t(locale, "dashboard.projects.title")}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {t(locale, "dashboard.projects.subtitle")}
      </p>

      {projects.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          {t(locale, "dashboard.projects.empty")}
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {projects.map((project) => (
            <li
              key={project.slug}
              className="grid gap-4 rounded-xl border border-foreground/10 bg-white/70 p-4 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-semibold text-foreground">{project.title}</p>
                <p className="mt-1 text-sm text-muted">{project.city}</p>
              </div>
              <Link
                href={`/${locale}/dashboard/projects/${project.slug}`}
                className="text-sm font-semibold tracking-[0.08em] text-muted uppercase"
              >
                {t(locale, "dashboard.viewProgress")}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
