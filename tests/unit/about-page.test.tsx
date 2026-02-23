import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/[locale]/about/page";

describe("Localized about page", () => {
  it("shows english heading", async () => {
    const page = await AboutPage({ params: Promise.resolve({ locale: "en" }) });
    render(page);

    expect(
      screen.getByRole("heading", {
        name: /about building investment/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows bulgarian heading", async () => {
    const page = await AboutPage({ params: Promise.resolve({ locale: "bg" }) });
    render(page);

    expect(
      screen.getByRole("heading", {
        name: /за building investment/i,
      }),
    ).toBeInTheDocument();
  });
});
