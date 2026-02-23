type DashboardDocumentInput = {
  category: string;
  createdAt: string;
  fileName: string;
  filePath: string;
  id: string;
  title: string;
};

export type DashboardDocument = {
  category: string;
  createdAt: string;
  fileName: string;
  filePath: string;
  id: string;
  title: string;
};

export function buildDashboardDocuments(input: {
  documents: DashboardDocumentInput[];
}): DashboardDocument[] {
  return input.documents
    .map((document) => ({
      category: document.category || "other",
      createdAt: document.createdAt,
      fileName: document.fileName || "document",
      filePath: document.filePath,
      id: document.id || "unknown-document",
      title: document.title || "Untitled document",
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    );
}
