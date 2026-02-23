export type DashboardProfile = {
  currency: string;
  email: string;
  fullName: string;
  kycStatus: string;
  locale: string;
};

export function buildDashboardProfile(input: {
  currency: string;
  email: string;
  firstName: string;
  kycStatus: string;
  lastName: string;
  locale: string;
}): DashboardProfile {
  const fullName = `${input.firstName} ${input.lastName}`.trim();

  return {
    currency: input.currency || "EUR",
    email: input.email || "unknown@example.com",
    fullName: fullName || "Investor",
    kycStatus: input.kycStatus || "not_started",
    locale: input.locale || "en",
  };
}
