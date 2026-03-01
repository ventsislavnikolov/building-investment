import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const getProgressUpdates = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = createSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("Unauthenticated");

		// Fetch progress updates for projects the user has invested in
		const { data: investedProjectIds } = await supabase
			.from("investments")
			.select("project_id")
			.eq("investor_id", user.id)
			.in("status", ["active", "returning", "exited"]);

		const ids = (investedProjectIds ?? []).map((i) => i.project_id);
		if (ids.length === 0) return [];

		const { data } = await supabase
			.from("progress_updates")
			.select("id, title, body, published_at, projects(title, slug)")
			.in("project_id", ids)
			.eq("is_published", true)
			.order("published_at", { ascending: false });

		return data ?? [];
	},
);

export const Route = createFileRoute("/(locale)/dashboard/progress" as never)({
	loader: () => getProgressUpdates(),
	component: ProgressPage,
});

function ProgressPage() {
	const updates = Route.useLoaderData();

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-[#151515]">Progress Updates</h1>
				<p className="text-sm text-[#ACB3BA] mt-1">
					Latest updates from your invested projects
				</p>
			</div>

			{updates.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-[#ACB3BA] p-12 text-center">
					<p className="text-[#ACB3BA]">No updates yet.</p>
					<p className="text-sm text-[#ACB3BA] mt-1">
						Progress updates from your projects will appear here.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{updates.map((update, idx) => {
						const project = update.projects as {
							title: string;
							slug: string;
						} | null;
						const isFirst = idx === 0;

						return (
							<div key={update.id} className="flex gap-4">
								{/* Timeline dot */}
								<div className="flex flex-col items-center">
									<div
										className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${isFirst ? "bg-[#1B59E8]" : "bg-[#ACB3BA]"}`}
									/>
									{idx < updates.length - 1 && (
										<div className="w-px flex-1 bg-[#EEF2F6] mt-1" />
									)}
								</div>

								{/* Content */}
								<div className="bg-white rounded-2xl border border-[#EEF2F6] p-5 flex-1 mb-4">
									<div className="flex items-start justify-between gap-4 mb-2">
										<div>
											<span className="text-xs font-medium text-[#1B59E8] uppercase tracking-wide">
												{project?.title ?? "Project"}
											</span>
											<h3 className="text-base font-semibold text-[#151515] mt-0.5">
												{update.title}
											</h3>
										</div>
										<span className="text-xs text-[#ACB3BA] whitespace-nowrap">
											{update.published_at
												? new Date(update.published_at).toLocaleDateString(
														"en-GB",
													)
												: "—"}
										</span>
									</div>
									<p className="text-sm text-[#ACB3BA] leading-relaxed line-clamp-3">
										{update.body}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
