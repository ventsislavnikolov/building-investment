import { buildDashboardKycStatus } from "@/lib/dashboard/kyc";

describe("dashboard kyc", () => {
  it("normalizes known status and computes action hint", () => {
    const kyc = buildDashboardKycStatus({
      kycStatus: "pending",
      verifiedAt: "",
    });

    expect(kyc.status).toBe("pending");
    expect(kyc.isComplete).toBe(false);
    expect(kyc.action).toBe("continue_verification");
  });

  it("marks approved status as complete", () => {
    const kyc = buildDashboardKycStatus({
      kycStatus: "approved",
      verifiedAt: "2025-02-23T08:00:00.000Z",
    });

    expect(kyc.status).toBe("approved");
    expect(kyc.isComplete).toBe(true);
    expect(kyc.action).toBe("none");
    expect(kyc.verifiedAt).toBe("2025-02-23T08:00:00.000Z");
  });

  it("falls back unknown values to not_started", () => {
    const kyc = buildDashboardKycStatus({
      kycStatus: "unexpected_value",
      verifiedAt: "",
    });

    expect(kyc.status).toBe("not_started");
    expect(kyc.action).toBe("start_verification");
  });
});
