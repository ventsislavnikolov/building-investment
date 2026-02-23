import {
  defaultLocale,
  getLocalizedPath,
  hasAuthSessionCookie,
  isDashboardPath,
  isProjectInvestPath,
  isSupportedLocale,
  supportedLocales,
} from "@/lib/routing";

describe("routing helpers", () => {
  it("exposes locale defaults", () => {
    expect(supportedLocales).toEqual(["en", "bg"]);
    expect(defaultLocale).toBe("en");
  });

  it("detects supported locales", () => {
    expect(isSupportedLocale("en")).toBe(true);
    expect(isSupportedLocale("bg")).toBe(true);
    expect(isSupportedLocale("de")).toBe(false);
  });

  it("localizes paths that miss locale prefix", () => {
    expect(getLocalizedPath("/")).toBe("/en");
    expect(getLocalizedPath("/projects")).toBe("/en/projects");
    expect(getLocalizedPath("/en/projects")).toBe("/en/projects");
  });

  it("detects dashboard-protected paths", () => {
    expect(isDashboardPath("/en/dashboard")).toBe(true);
    expect(isDashboardPath("/bg/dashboard/investments")).toBe(true);
    expect(isDashboardPath("/en/projects")).toBe(false);
  });

  it("detects project invest protected paths", () => {
    expect(
      isProjectInvestPath("/en/projects/varna-seaside-rentals/invest"),
    ).toBe(true);
    expect(isProjectInvestPath("/bg/projects/sofia-apartment-reposition")).toBe(
      false,
    );
  });

  it("detects presence of auth session cookie", () => {
    expect(hasAuthSessionCookie("foo=bar; sb-access-token=abc123")).toBe(true);
    expect(hasAuthSessionCookie("foo=bar; baz=qux")).toBe(false);
    expect(hasAuthSessionCookie(null)).toBe(false);
  });
});
