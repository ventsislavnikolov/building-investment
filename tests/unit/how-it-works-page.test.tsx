import { render, screen } from "@testing-library/react";
import HowItWorksPage from "@/app/[locale]/how-it-works/page";

describe("Localized how-it-works page", () => {
  it("shows english heading", async () => {
    const page = await HowItWorksPage({
      params: Promise.resolve({ locale: "en" }),
    });
    render(page);

    expect(
      screen.getByRole("heading", {
        name: /how it works/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows bulgarian heading", async () => {
    const page = await HowItWorksPage({
      params: Promise.resolve({ locale: "bg" }),
    });
    render(page);

    expect(
      screen.getByRole("heading", {
        name: /как работи/i,
      }),
    ).toBeInTheDocument();
  });
});
