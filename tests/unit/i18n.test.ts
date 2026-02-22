import { t } from "@/lib/i18n";

describe("i18n dictionary", () => {
  it("returns Bulgarian translation for homepage headline", () => {
    expect(t("bg", "home.headline")).toMatch(/Български|инвести/i);
  });

  it("falls back to English for unknown locale", () => {
    expect(t("en", "login.submit")).toBe("Sign In");
  });
});
