import { processInvestmentCheckoutSubmission } from "@/lib/investments/checkout";

function buildFormData(values: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }
  return formData;
}

describe("investment checkout submission", () => {
  it("returns validation errors for invalid amount", async () => {
    const result = await processInvestmentCheckoutSubmission(
      buildFormData({
        amount: "10",
        locale: "en",
        maxAmount: "100000",
        minAmount: "100",
        slug: "varna-seaside-rentals",
      }),
      async () => ({ checkoutUrl: "/en/dashboard/investments", ok: true }),
    );

    expect(result.ok).toBe(false);
    expect(result.errors?.amount).toMatch(/at least/i);
  });

  it("sanitizes unsafe checkout redirect URLs", async () => {
    const result = await processInvestmentCheckoutSubmission(
      buildFormData({
        amount: "500",
        locale: "bg",
        maxAmount: "100000",
        minAmount: "100",
        slug: "varna-seaside-rentals",
      }),
      async () => ({ checkoutUrl: "https://evil.example.com", ok: true }),
    );

    expect(result.ok).toBe(true);
    expect(result.redirectTo).toBe("/bg/dashboard/investments");
  });

  it("returns provider error when checkout creation fails", async () => {
    const result = await processInvestmentCheckoutSubmission(
      buildFormData({
        amount: "500",
        locale: "en",
        maxAmount: "100000",
        minAmount: "100",
        slug: "varna-seaside-rentals",
      }),
      async () => ({ error: "Checkout unavailable", ok: false }),
    );

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Checkout unavailable");
  });
});
