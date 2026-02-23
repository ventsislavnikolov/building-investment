import { buildDashboardProfile } from "@/lib/dashboard/profile";

describe("dashboard profile", () => {
  it("builds a readable full name when first and last names are present", () => {
    const profile = buildDashboardProfile({
      currency: "EUR",
      email: "investor@example.com",
      firstName: "Ivan",
      kycStatus: "approved",
      lastName: "Petrov",
      locale: "bg",
    });

    expect(profile.fullName).toBe("Ivan Petrov");
    expect(profile.email).toBe("investor@example.com");
    expect(profile.kycStatus).toBe("approved");
  });

  it("falls back to email/locales when optional fields are missing", () => {
    const profile = buildDashboardProfile({
      currency: "",
      email: "",
      firstName: "",
      kycStatus: "",
      lastName: "",
      locale: "",
    });

    expect(profile.fullName).toBe("Investor");
    expect(profile.email).toBe("unknown@example.com");
    expect(profile.locale).toBe("en");
    expect(profile.currency).toBe("EUR");
    expect(profile.kycStatus).toBe("not_started");
  });
});
