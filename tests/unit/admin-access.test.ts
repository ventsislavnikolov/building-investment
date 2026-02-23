import { evaluateAdminAccess } from "@/lib/auth/admin-access";

describe("admin access", () => {
  it("allows access for admin role", () => {
    const result = evaluateAdminAccess("en", {
      id: "user-1",
      role: "admin",
    });

    expect(result.ok).toBe(true);
  });

  it("allows access for project_owner role", () => {
    const result = evaluateAdminAccess("bg", {
      id: "user-1",
      role: "project_owner",
    });

    expect(result.ok).toBe(true);
  });

  it("redirects to login when user is missing", () => {
    const result = evaluateAdminAccess("en", null);

    expect(result.ok).toBe(false);
    expect(result.redirectTo).toBe("/en/login?next=%2Fen%2Fadmin%2Fdashboard");
  });

  it("redirects non-admin users to dashboard", () => {
    const result = evaluateAdminAccess("bg", {
      id: "user-1",
      role: "investor",
    });

    expect(result.ok).toBe(false);
    expect(result.redirectTo).toBe("/bg/dashboard");
  });

  it("supports custom admin next path for login redirects", () => {
    const result = evaluateAdminAccess(
      "en",
      null,
      "/en/admin/projects?state=pipeline",
    );

    expect(result.ok).toBe(false);
    expect(result.redirectTo).toBe(
      "/en/login?next=%2Fen%2Fadmin%2Fprojects%3Fstate%3Dpipeline",
    );
  });
});
