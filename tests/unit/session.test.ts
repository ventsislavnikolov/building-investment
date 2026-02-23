import { evaluateDashboardAccess } from "@/lib/auth/session";

describe("dashboard session access", () => {
  it("allows access when user exists", () => {
    const result = evaluateDashboardAccess("en", {
      id: "user-1",
      email: "investor@example.com",
    });

    expect(result.ok).toBe(true);
    expect(result.user?.email).toBe("investor@example.com");
  });

  it("returns login redirect when user is missing", () => {
    const result = evaluateDashboardAccess("bg", null);

    expect(result.ok).toBe(false);
    expect(result.redirectTo).toBe("/bg/login?next=%2Fbg%2Fdashboard");
  });

  it("supports custom next path for nested dashboard routes", () => {
    const result = evaluateDashboardAccess(
      "en",
      null,
      "/en/dashboard/portfolio",
    );

    expect(result.ok).toBe(false);
    expect(result.redirectTo).toBe(
      "/en/login?next=%2Fen%2Fdashboard%2Fportfolio",
    );
  });
});
