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
): AccessAllowed | AccessDenied {
  if (!user) {
    const nextPath = encodeURIComponent(`/${locale}/dashboard`);
    return {
      ok: false,
      redirectTo: `/${locale}/login?next=${nextPath}`,
    };
  }

  return {
    ok: true,
    user,
  };
}
