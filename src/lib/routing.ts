export const supportedLocales = ["en", "bg"] as const;
export type AppLocale = (typeof supportedLocales)[number];

export const defaultLocale: AppLocale = "en";

const authCookiePatterns = [
  /sb-access-token=/i,
  /supabase-auth-token=/i,
  /sb-[a-z0-9_-]+-auth-token=/i,
];

export function isSupportedLocale(value: string): value is AppLocale {
  return supportedLocales.includes(value as AppLocale);
}

export function getLocaleFromPath(pathname: string): AppLocale | null {
  const [, firstSegment = ""] = pathname.split("/");
  return isSupportedLocale(firstSegment) ? firstSegment : null;
}

export function getLocalizedPath(pathname: string): string {
  if (getLocaleFromPath(pathname)) {
    return pathname;
  }

  if (pathname === "/") {
    return `/${defaultLocale}`;
  }

  return `/${defaultLocale}${pathname}`;
}

export function isDashboardPath(pathname: string): boolean {
  return /^\/(en|bg)\/dashboard(\/|$)/.test(pathname);
}

export function hasAuthSessionCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) {
    return false;
  }

  return authCookiePatterns.some((pattern) => pattern.test(cookieHeader));
}
