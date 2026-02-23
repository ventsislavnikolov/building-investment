import { processRegisterSubmission } from "@/lib/auth/register";

function buildFormData(values: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }
  return formData;
}

describe("register submission", () => {
  it("returns validation errors for invalid profile and password input", async () => {
    const result = await processRegisterSubmission(
      buildFormData({
        firstName: "A",
        lastName: "",
        email: "invalid-email",
        password: "123",
        confirmPassword: "12345678",
        locale: "en",
      }),
      async () => ({ ok: true, sessionCreated: true }),
    );

    expect(result.ok).toBe(false);
    expect(result.errors?.firstName).toMatch(/at least 2/i);
    expect(result.errors?.lastName).toMatch(/at least 2/i);
    expect(result.errors?.email).toMatch(/valid email/i);
    expect(result.errors?.password).toMatch(/at least 8/i);
    expect(result.errors?.confirmPassword).toMatch(/match/i);
  });

  it("sanitizes unsafe next redirect targets", async () => {
    const result = await processRegisterSubmission(
      buildFormData({
        firstName: "Ivan",
        lastName: "Petrov",
        email: "investor@example.com",
        password: "password123",
        confirmPassword: "password123",
        locale: "bg",
        next: "https://evil.example.com/steal",
      }),
      async () => ({ ok: true, sessionCreated: true }),
    );

    expect(result.ok).toBe(true);
    expect(result.redirectTo).toBe("/bg/dashboard");
  });

  it("returns auth error when provider rejects registration", async () => {
    const result = await processRegisterSubmission(
      buildFormData({
        firstName: "Ivan",
        lastName: "Petrov",
        email: "investor@example.com",
        password: "password123",
        confirmPassword: "password123",
        locale: "en",
      }),
      async () => ({ ok: false, error: "Account already exists" }),
    );

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Account already exists");
  });

  it("keeps user on register page when email confirmation is required", async () => {
    const result = await processRegisterSubmission(
      buildFormData({
        firstName: "Ivan",
        lastName: "Petrov",
        email: "investor@example.com",
        password: "password123",
        confirmPassword: "password123",
        locale: "en",
      }),
      async () => ({ ok: true, sessionCreated: false }),
    );

    expect(result.ok).toBe(true);
    expect(result.redirectTo).toBeUndefined();
    expect(result.message).toMatch(/check your email/i);
  });
});
