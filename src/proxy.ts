import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getLocaleFromPath,
  getLocalizedPath,
  hasAuthSessionCookie,
  isDashboardPath,
  isProjectInvestPath,
} from "@/lib/routing";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const localizedPath = getLocalizedPath(pathname);

  if (localizedPath !== pathname) {
    return NextResponse.redirect(
      new URL(`${localizedPath}${search}`, request.url),
    );
  }

  if (
    (isDashboardPath(pathname) || isProjectInvestPath(pathname)) &&
    !hasAuthSessionCookie(request.headers.get("cookie"))
  ) {
    const locale = getLocaleFromPath(pathname) ?? "en";
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
