import { getEnv } from "@/env";

describe("environment validation", () => {
  it("returns validated env values", () => {
    const env = getEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "service-role",
      NEXT_PUBLIC_APP_URL: "https://building-investment.com",
    });

    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://project.supabase.co");
    expect(env.NEXT_PUBLIC_APP_URL).toBe("https://building-investment.com");
  });

  it("throws when required variables are missing", () => {
    expect(() =>
      getEnv({
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        SUPABASE_SERVICE_ROLE_KEY: "",
        NEXT_PUBLIC_APP_URL: "",
      }),
    ).toThrow(/missing or invalid environment variables/i);
  });
});
