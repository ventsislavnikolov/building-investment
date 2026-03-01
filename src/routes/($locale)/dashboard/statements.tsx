import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { FileText } from "lucide-react";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const getStatements = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("Unauthenticated");

	const { data } = await supabase
		.from("statements")
		.select("id, period_label, file_url, generated_at")
		.eq("investor_id", user.id)
		.order("generated_at", { ascending: false });

	return data ?? [];
});

export const Route = createFileRoute("/(locale)/dashboard/statements" as never)(
	{
		loader: () => getStatements(),
		component: StatementsPage,
	},
);

function StatementsPage() {
	const statements = Route.useLoaderData();

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-[#151515]">Statements</h1>
				<p className="text-sm text-[#ACB3BA] mt-1">
					Monthly account statements available for download
				</p>
			</div>

			{statements.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-[#ACB3BA] p-12 text-center">
					<FileText className="w-10 h-10 text-[#ACB3BA] mx-auto mb-3" />
					<p className="text-[#ACB3BA]">No statements yet.</p>
					<p className="text-sm text-[#ACB3BA] mt-1">
						Monthly statements will be generated automatically.
					</p>
				</div>
			) : (
				<div className="bg-white rounded-2xl border border-[#EEF2F6] divide-y divide-[#EEF2F6]">
					{statements.map((s) => (
						<div
							key={s.id}
							className="flex items-center justify-between px-5 py-4 hover:bg-[#EEF2F6]/40"
						>
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-lg bg-[#CEE8FB] flex items-center justify-center">
									<FileText className="w-4 h-4 text-[#1B59E8]" />
								</div>
								<div>
									<p className="text-sm font-medium text-[#151515]">
										{s.period_label}
									</p>
									<p className="text-xs text-[#ACB3BA]">
										{s.generated_at
											? new Date(s.generated_at).toLocaleDateString("en-GB")
											: "—"}
									</p>
								</div>
							</div>
							<a
								href={s.file_url}
								target="_blank"
								rel="noreferrer"
								className="text-sm font-medium text-[#1B59E8] hover:underline"
							>
								Download PDF
							</a>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
