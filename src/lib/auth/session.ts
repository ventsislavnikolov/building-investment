import type { AppLocale } from "@/lib/routing";

type DashboardUser = {
  id: string;
  email?: string | null;
};

type AccessAllowed = {
  ok: true;
  user: DashboardUser;
};

type AccessDenied = {
  ok: false;
  redirectTo: string;
};

export function evaluateDashboardAccess(
  locale: AppLocale,
  user: DashboardUser | null,
  nextPath = `/${locale}/dashboard`,
): AccessAllowed | AccessDenied {
  if (!user) {
    const encodedNextPath = encodeURIComponent(nextPath);
    return {
      ok: false,
      redirectTo: `/${locale}/login?next=${encodedNextPath}`,
    };
  }

  return {
    ok: true,
    user,
  };
}
