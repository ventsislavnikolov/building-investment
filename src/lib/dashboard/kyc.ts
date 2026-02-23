type KycStatus =
  | "not_started"
  | "pending"
  | "approved"
  | "rejected"
  | "expired";

export type DashboardKycStatus = {
  action: "start_verification" | "continue_verification" | "none";
  isComplete: boolean;
  status: KycStatus;
  verifiedAt: string | null;
};

const validStatuses = new Set<KycStatus>([
  "not_started",
  "pending",
  "approved",
  "rejected",
  "expired",
]);

export function buildDashboardKycStatus(input: {
  kycStatus: string;
  verifiedAt: string;
}): DashboardKycStatus {
  const status = validStatuses.has(input.kycStatus as KycStatus)
    ? (input.kycStatus as KycStatus)
    : "not_started";

  if (status === "approved") {
    return {
      action: "none",
      isComplete: true,
      status,
      verifiedAt: input.verifiedAt || null,
    };
  }

  return {
    action:
      status === "not_started" ? "start_verification" : "continue_verification",
    isComplete: false,
    status,
    verifiedAt: null,
  };
}
