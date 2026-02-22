import { processLoginSubmission } from "@/lib/auth/login";

function buildFormData(values: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }
  return formData;
}

describe("login submission", () => {
  it("returns validation errors for invalid input", async () => {
    const result = await processLoginSubmission(
      buildFormData({
        email: "invalid-email",
        password: "123",
        locale: "en",
      }),
      async () => ({ ok: true }),
    );

    expect(result.ok).toBe(false);
    expect(result.errors?.email).toMatch(/valid email/i);
    expect(result.errors?.password).toMatch(/at least 8/i);
  });

  it("sanitizes unsafe next redirect targets", async () => {
    const result = await processLoginSubmission(
      buildFormData({
        email: "investor@example.com",
        password: "password123",
        locale: "bg",
        next: "https://evil.example.com/steal",
      }),
      async () => ({ ok: true }),
    );

    expect(result.ok).toBe(true);
    expect(result.redirectTo).toBe("/bg/dashboard");
  });

  it("returns auth error when provider rejects login", async () => {
    const result = await processLoginSubmission(
      buildFormData({
        email: "investor@example.com",
        password: "password123",
        locale: "en",
      }),
      async () => ({ ok: false, error: "Invalid credentials" }),
    );

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Invalid credentials");
  });
});
