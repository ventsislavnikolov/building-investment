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
): AdminAccessAllowed | AdminAccessDenied {
  if (!user) {
    return {
      ok: false,
      redirectTo: `/${locale}/login?next=${encodeURIComponent(`/${locale}/admin/dashboard`)}`,
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
