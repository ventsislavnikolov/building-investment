import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  defaultLocale,
  getCanonicalPath,
  getInternalLocalizedPath,
  getLocaleFromPath,
  hasAuthSessionCookie,
  isAdminPath,
  isDashboardPath,
  isProjectInvestPath,
} from "@/lib/routing";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const canonicalPath = getCanonicalPath(pathname);
  const internalLocalizedPath = getInternalLocalizedPath(canonicalPath);

  if (canonicalPath !== pathname) {
    return NextResponse.redirect(
      new URL(`${canonicalPath}${search}`, request.url),
    );
  }

  if (
    (isDashboardPath(internalLocalizedPath) ||
      isProjectInvestPath(internalLocalizedPath) ||
      isAdminPath(internalLocalizedPath)) &&
    !hasAuthSessionCookie(request.headers.get("cookie"))
  ) {
    const locale = getLocaleFromPath(internalLocalizedPath) ?? defaultLocale;
    const loginPath = locale === defaultLocale ? "/login" : `/${locale}/login`;
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("next", canonicalPath);
    return NextResponse.redirect(loginUrl);
  }

  if (internalLocalizedPath !== pathname) {
    return NextResponse.rewrite(
      new URL(`${internalLocalizedPath}${search}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
