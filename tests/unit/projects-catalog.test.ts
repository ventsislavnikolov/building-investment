import { getProjectCatalog } from "@/lib/projects/catalog";

describe("project catalog", () => {
  it("returns localized titles for Bulgarian locale", () => {
    const catalog = getProjectCatalog({
      locale: "bg",
      strategy: "all",
      search: "",
    });

    expect(catalog.items[0]?.title).toMatch(/[А-Яа-я]/);
  });

  it("filters projects by strategy", () => {
    const catalog = getProjectCatalog({
      locale: "en",
      strategy: "buy_to_rent",
      search: "",
    });

    expect(catalog.items.length).toBeGreaterThan(0);
    expect(catalog.items.every((item) => item.strategy === "buy_to_rent")).toBe(
      true,
    );
  });

  it("filters by free text search", () => {
    const catalog = getProjectCatalog({
      locale: "en",
      strategy: "all",
      search: "varna",
    });

    expect(catalog.items.length).toBe(1);
    expect(catalog.items[0]?.slug).toBe("varna-seaside-rentals");
  });

  it("sorts projects by funded descending", () => {
    const catalog = getProjectCatalog({
      locale: "en",
      strategy: "all",
      search: "",
      sort: "funded_desc",
    });

    expect(catalog.items[0]?.fundedPct).toBeGreaterThanOrEqual(
      catalog.items[1]?.fundedPct ?? 0,
    );
  });

  it("sorts projects by expected IRR descending", () => {
    const catalog = getProjectCatalog({
      locale: "en",
      strategy: "all",
      search: "",
      sort: "irr_desc",
    });

    expect(catalog.items[0]?.expectedIrrPct).toBeGreaterThanOrEqual(
      catalog.items[1]?.expectedIrrPct ?? 0,
    );
  });
});
