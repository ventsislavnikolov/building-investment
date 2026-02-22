import { getProjectBySlug } from "@/lib/projects/catalog";

describe("project detail lookup", () => {
  it("returns localized detail record by slug", () => {
    const project = getProjectBySlug("varna-seaside-rentals", "bg");

    expect(project).not.toBeNull();
    expect(project?.title).toBe("Варненски апартаменти под наем");
    expect(project?.city).toBe("Varna");
  });

  it("returns null for unknown slug", () => {
    expect(getProjectBySlug("unknown-project", "en")).toBeNull();
  });
});
