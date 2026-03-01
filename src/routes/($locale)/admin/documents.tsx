import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { FileText } from "lucide-react";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";

const getAllDocuments = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseAdminClient();
	const { data } = await supabase
		.from("documents")
		.select(
			"id, name, category, file_url, created_at, project:projects(title_en)",
		)
		.order("created_at", { ascending: false });
	return data ?? [];
});

export const Route = createFileRoute("/($locale)/admin/documents")({
	loader: async () => {
		const documents = await getAllDocuments();
		return { documents };
	},
	component: function AdminDocumentsPage() {
		const { documents } = Route.useLoaderData();

		return (
			<div className="space-y-6 max-w-4xl">
				<div>
					<h1 className="text-2xl font-bold text-text">Documents</h1>
					<p className="text-muted mt-1">{documents.length} document(s)</p>
				</div>

				{documents.length === 0 ? (
					<div className="rounded-2xl border border-border bg-white p-8 text-center">
						<FileText className="w-10 h-10 text-muted mx-auto mb-3" />
						<p className="text-muted">No documents uploaded yet.</p>
					</div>
				) : (
					<div className="rounded-2xl border border-border bg-white overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="border-b border-border bg-[#f8f9fa]">
									<tr>
										<th className="text-left px-5 py-3 font-medium text-muted">
											Name
										</th>
										<th className="text-left px-5 py-3 font-medium text-muted">
											Category
										</th>
										<th className="text-left px-5 py-3 font-medium text-muted">
											Project
										</th>
										<th className="text-right px-5 py-3 font-medium text-muted">
											Date
										</th>
										<th className="px-5 py-3" />
									</tr>
								</thead>
								<tbody className="divide-y divide-border">
									{documents.map((doc) => (
										<tr
											key={doc.id}
											className="hover:bg-[#f8f9fa] transition-colors"
										>
											<td className="px-5 py-3 font-medium text-text">
												{doc.name}
											</td>
											<td className="px-5 py-3 text-muted capitalize">
												{doc.category?.replace(/_/g, " ") ?? "—"}
											</td>
											<td className="px-5 py-3 text-muted">
												{(doc.project as { title_en?: string } | null)
													?.title_en ?? "—"}
											</td>
											<td className="px-5 py-3 text-right text-muted">
												{new Date(doc.created_at).toLocaleDateString("en-GB")}
											</td>
											<td className="px-5 py-3 text-right">
												<a
													href={doc.file_url}
													target="_blank"
													rel="noreferrer"
													className="text-xs text-primary font-medium hover:underline"
												>
													Download
												</a>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		);
	},
});
