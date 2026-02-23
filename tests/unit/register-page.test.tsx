import { render, screen } from "@testing-library/react";
import RegisterPage from "@/app/[locale]/register/page";

describe("Localized register page", () => {
  it("shows english register headline", async () => {
    const page = await RegisterPage({
      params: Promise.resolve({ locale: "en" }),
    });
    render(page);

    expect(
      screen.getByRole("heading", {
        name: /create investor account/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows bulgarian register headline", async () => {
    const page = await RegisterPage({
      params: Promise.resolve({ locale: "bg" }),
    });
    render(page);

    expect(
      screen.getByRole("heading", {
        name: /създай инвеститорски профил/i,
      }),
    ).toBeInTheDocument();
  });
});
