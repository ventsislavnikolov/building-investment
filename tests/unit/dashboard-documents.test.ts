import { buildDashboardDocuments } from "@/lib/dashboard/documents";

describe("dashboard documents", () => {
  it("sorts documents by newest first", () => {
    const documents = buildDashboardDocuments({
      documents: [
        {
          category: "legal",
          createdAt: "2025-01-10T10:00:00.000Z",
          fileName: "terms.pdf",
          filePath: "project-documents/terms.pdf",
          id: "d1",
          title: "Terms",
        },
        {
          category: "financial",
          createdAt: "2025-02-01T12:00:00.000Z",
          fileName: "budget.xlsx",
          filePath: "project-documents/budget.xlsx",
          id: "d2",
          title: "Budget",
        },
      ],
    });

    expect(documents).toHaveLength(2);
    expect(documents[0].id).toBe("d2");
    expect(documents[1].id).toBe("d1");
  });

  it("handles missing optional values safely", () => {
    const documents = buildDashboardDocuments({
      documents: [
        {
          category: "",
          createdAt: "",
          fileName: "",
          filePath: "",
          id: "",
          title: "",
        },
      ],
    });

    expect(documents[0]).toMatchObject({
      category: "other",
      fileName: "document",
      id: "unknown-document",
      title: "Untitled document",
    });
  });
});
