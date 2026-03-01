import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { FileText } from "lucide-react";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const getMyDocuments = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("Unauthenticated");

	const { data } = await supabase
		.from("documents")
		.select(
			"id, category, name, file_url, created_at, project:projects(title_en)",
		)
		.or(
			`uploaded_by.eq.${user.id},investment_id.in.(select id from investments where investor_id.eq.${user.id})`,
		)
		.order("created_at", { ascending: false });

	return data ?? [];
});

const CATEGORY_LABELS: Record<string, string> = {
	investment_agreement: "Investment Agreement",
	disclosure: "Risk Disclosure",
	kyc: "KYC Document",
	tax: "Tax Certificate",
	progress: "Progress Report",
	other: "Other",
};

export const Route = createFileRoute("/($locale)/dashboard/documents")({
	loader: async () => {
		const documents = await getMyDocuments();
		return { documents };
	},
	component: function DocumentsPage() {
		const { documents } = Route.useLoaderData();

		// Group by category
		const grouped: Record<string, typeof documents> = {};
		for (const doc of documents) {
			const cat = doc.category ?? "other";
			if (!grouped[cat]) grouped[cat] = [];
			grouped[cat].push(doc);
		}

		return (
			<div className="space-y-6 max-w-3xl">
				<div>
					<h1 className="text-2xl font-bold text-text">Documents</h1>
					<p className="text-muted mt-1">{documents.length} document(s)</p>
				</div>

				{documents.length === 0 ? (
					<div className="rounded-2xl border border-border bg-white p-8 text-center">
						<FileText className="w-10 h-10 text-muted mx-auto mb-3" />
						<p className="text-text font-medium">No documents yet</p>
						<p className="text-sm text-muted mt-1">
							Documents related to your investments will appear here.
						</p>
					</div>
				) : (
					<div className="space-y-6">
						{Object.entries(grouped).map(([category, docs]) => (
							<div
								key={category}
								className="rounded-2xl border border-border bg-white overflow-hidden"
							>
								<div className="px-5 py-3 border-b border-border bg-[#f8f9fa]">
									<h2 className="text-sm font-semibold text-text">
										{CATEGORY_LABELS[category] ?? category}
									</h2>
								</div>
								<div className="divide-y divide-border">
									{docs.map((doc) => (
										<a
											key={doc.id}
											href={doc.file_url}
											target="_blank"
											rel="noreferrer"
											className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#f8f9fa] transition-colors"
										>
											<FileText className="w-5 h-5 text-primary flex-shrink-0" />
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-text truncate">
													{doc.name}
												</p>
												<p className="text-xs text-muted">
													{(doc.project as { title_en?: string } | null)
														?.title_en ?? "—"}{" "}
													·{" "}
													{new Date(doc.created_at).toLocaleDateString("en-GB")}
												</p>
											</div>
											<span className="text-xs text-primary font-medium">
												Download
											</span>
										</a>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		);
	},
});
