import { buildDashboardProgress } from "@/lib/dashboard/progress";

describe("dashboard progress", () => {
  it("keeps only published updates and sorts by publish date descending", () => {
    const result = buildDashboardProgress({
      updates: [
        {
          budgetStatus: "on_track",
          id: "u1",
          projectTitle: "Sofia Apartment Reposition",
          publishedAt: "2025-02-10T12:00:00.000Z",
          timelineStatus: "on_track",
          title: "Permit approved",
        },
        {
          budgetStatus: "over_budget",
          id: "u2",
          projectTitle: "Varna Seaside Rentals",
          publishedAt: "2025-02-20T09:00:00.000Z",
          timelineStatus: "delayed",
          title: "Foundation delay",
        },
        {
          budgetStatus: "under_budget",
          id: "u3",
          projectTitle: "Plovdiv Urban Hub",
          publishedAt: "",
          timelineStatus: "ahead",
          title: "Draft note",
        },
      ],
    });

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("u2");
    expect(result[1].id).toBe("u1");
  });

  it("normalizes missing fields safely", () => {
    const result = buildDashboardProgress({
      updates: [
        {
          budgetStatus: "",
          id: "",
          projectTitle: "",
          publishedAt: "2025-02-01T00:00:00.000Z",
          timelineStatus: "",
          title: "",
        },
      ],
    });

    expect(result[0]).toMatchObject({
      budgetStatus: "unknown",
      id: "unknown-update",
      projectTitle: "Unknown project",
      timelineStatus: "unknown",
      title: "Untitled update",
    });
  });
});
