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

function withLeadingSlash(pathname: string): string {
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function stripDefaultLocalePrefix(pathname: string): string {
  if (pathname === `/${defaultLocale}`) {
    return "/";
  }

  if (pathname.startsWith(`/${defaultLocale}/`)) {
    const strippedPath = pathname.slice(defaultLocale.length + 1);
    return strippedPath.length === 0 ? "/" : strippedPath;
  }

  return pathname;
}

export function getCanonicalPath(pathname: string): string {
  const normalizedPathname = withLeadingSlash(pathname);
  return stripDefaultLocalePrefix(normalizedPathname);
}

export function getInternalLocalizedPath(pathname: string): string {
  const normalizedPathname = withLeadingSlash(pathname);

  if (getLocaleFromPath(normalizedPathname)) {
    return normalizedPathname;
  }

  if (normalizedPathname === "/") {
    return `/${defaultLocale}`;
  }

  return `/${defaultLocale}${normalizedPathname}`;
}

export function getLocalizedPath(pathname: string): string {
  return getCanonicalPath(pathname);
}

export function isDashboardPath(pathname: string): boolean {
  return /^\/(en|bg)\/dashboard(\/|$)/.test(pathname);
}

export function isProjectInvestPath(pathname: string): boolean {
  return /^\/(en|bg)\/projects\/[^/]+\/invest(\/|$)/.test(pathname);
}

export function isAdminPath(pathname: string): boolean {
  return /^\/(en|bg)\/admin(\/|$)/.test(pathname);
}

export function hasAuthSessionCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) {
    return false;
  }

  return authCookiePatterns.some((pattern) => pattern.test(cookieHeader));
}
