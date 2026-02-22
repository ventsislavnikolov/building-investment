import { render, screen } from "@testing-library/react";
import Home from "@/app/[locale]/page";

describe("Localized homepage", () => {
  it("shows the MVP headline", async () => {
    const page = await Home({ params: Promise.resolve({ locale: "en" }) });
    render(page);
    expect(
      screen.getByRole("heading", {
        name: /invest in bulgarian real estate/i,
      }),
    ).toBeInTheDocument();
  });
});
