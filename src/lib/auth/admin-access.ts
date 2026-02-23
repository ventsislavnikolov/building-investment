import type { AppLocale } from "@/lib/routing";

type AdminUser = {
  id: string;
  role: string;
};

type AdminAccessAllowed = {
  ok: true;
  user: AdminUser;
};

type AdminAccessDenied = {
  ok: false;
  redirectTo: string;
};

const allowedRoles = new Set(["admin", "project_owner"]);

export function evaluateAdminAccess(
  locale: AppLocale,
  user: AdminUser | null,
  nextPath = `/${locale}/admin/dashboard`,
): AdminAccessAllowed | AdminAccessDenied {
  if (!user) {
    const encodedNextPath = encodeURIComponent(nextPath);
    return {
      ok: false,
      redirectTo: `/${locale}/login?next=${encodedNextPath}`,
    };
  }

  if (!allowedRoles.has(user.role)) {
    return {
      ok: false,
      redirectTo: `/${locale}/dashboard`,
    };
  }

  return {
    ok: true,
    user,
  };
}
