import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";

const getAdminProject = createServerFn({ method: "GET" })
	.inputValidator((d: { id: string }) => d)
	.handler(async ({ data }) => {
		const supabase = createSupabaseAdminClient();

		const { data: project } = await supabase
			.from("projects")
			.select(
				`id, title, slug, status, funded_amount, target_amount, irr_min, irr_max,
				 min_investment, location, updated_at, created_at,
				 investments(count), investments(investor_id)`,
			)
			.eq("id", data.id)
			.single();

		const { data: investments } = await supabase
			.from("investments")
			.select("id, amount, status, created_at, profiles(full_name, email)")
			.eq("project_id", data.id)
			.order("created_at", { ascending: false });

		return { project, investments: investments ?? [] };
	});

export const Route = createFileRoute("/(locale)/admin/projects/$id" as never)({
	loader: ({ params }) => getAdminProject({ data: { id: params.id } }),
	component: AdminProjectDetailPage,
});

const STATUS_COLORS: Record<string, string> = {
	draft: "bg-gray-100 text-gray-700",
	fundraising: "bg-blue-100 text-blue-700",
	funded: "bg-purple-100 text-purple-700",
	in_execution: "bg-yellow-100 text-yellow-700",
	exiting: "bg-orange-100 text-orange-700",
	completed: "bg-green-100 text-green-700",
	cancelled: "bg-red-100 text-red-700",
};

function AdminProjectDetailPage() {
	const { project, investments } = Route.useLoaderData();

	if (!project) {
		return (
			<div className="p-6">
				<p className="text-[#ACB3BA]">Project not found.</p>
			</div>
		);
	}

	const fundedPct =
		project.target_amount > 0
			? Math.round((project.funded_amount / project.target_amount) * 100)
			: 0;

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Link
					to="/(locale)/admin/projects"
					className="text-[#ACB3BA] hover:text-[#151515] transition-colors"
				>
					<ArrowLeft className="w-5 h-5" />
				</Link>
				<div className="flex-1">
					<h1 className="text-2xl font-bold text-[#151515]">{project.title}</h1>
					<p className="text-sm text-[#ACB3BA]">{project.location}</p>
				</div>
				<span
					className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[project.status] ?? "bg-gray-100 text-gray-700"}`}
				>
					{project.status}
				</span>
				<Link
					to={`/projects/${project.slug}`}
					className="flex items-center gap-1.5 text-sm text-[#1B59E8] hover:underline"
				>
					View live <ExternalLink className="w-3.5 h-3.5" />
				</Link>
			</div>

			{/* KPIs */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{[
					{
						label: "Target",
						value: `€${project.target_amount?.toLocaleString()}`,
					},
					{
						label: "Raised",
						value: `€${project.funded_amount?.toLocaleString()}`,
					},
					{ label: "Funded", value: `${fundedPct}%` },
					{ label: "Investors", value: investments.length },
				].map(({ label, value }) => (
					<div
						key={label}
						className="bg-white rounded-2xl border border-[#EEF2F6] p-4"
					>
						<p className="text-xs text-[#ACB3BA] uppercase tracking-wide">
							{label}
						</p>
						<p className="text-2xl font-bold text-[#151515] mt-1">{value}</p>
					</div>
				))}
			</div>

			{/* Funding progress bar */}
			<div className="bg-white rounded-2xl border border-[#EEF2F6] p-5">
				<div className="flex justify-between text-sm mb-2">
					<span className="text-[#ACB3BA]">Funding progress</span>
					<span className="font-semibold text-[#151515]">{fundedPct}%</span>
				</div>
				<div className="h-2 bg-[#EEF2F6] rounded-full overflow-hidden">
					<div
						className="h-full bg-[#1B59E8] rounded-full"
						style={{ width: `${Math.min(fundedPct, 100)}%` }}
					/>
				</div>
			</div>

			{/* Cap table */}
			<div className="bg-white rounded-2xl border border-[#EEF2F6] overflow-hidden">
				<div className="px-5 py-4 border-b border-[#EEF2F6]">
					<h2 className="font-semibold text-[#151515]">
						Investments ({investments.length})
					</h2>
				</div>
				{investments.length === 0 ? (
					<p className="p-5 text-sm text-[#ACB3BA]">No investments yet.</p>
				) : (
					<table className="w-full text-sm">
						<thead className="bg-[#EEF2F6] text-[#ACB3BA] uppercase text-xs">
							<tr>
								<th className="text-left px-4 py-3">Investor</th>
								<th className="text-right px-4 py-3">Amount</th>
								<th className="text-left px-4 py-3">Status</th>
								<th className="text-left px-4 py-3">Date</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[#EEF2F6]">
							{investments.map((inv) => {
								const profile = inv.profiles as {
									full_name: string;
									email: string;
								} | null;
								return (
									<tr key={inv.id} className="hover:bg-[#EEF2F6]/40">
										<td className="px-4 py-3">
											<p className="font-medium text-[#151515]">
												{profile?.full_name ?? "—"}
											</p>
											<p className="text-xs text-[#ACB3BA]">
												{profile?.email ?? ""}
											</p>
										</td>
										<td className="px-4 py-3 text-right font-medium">
											€{inv.amount?.toLocaleString()}
										</td>
										<td className="px-4 py-3">
											<span className="text-xs bg-[#EEF2F6] px-2 py-0.5 rounded-full">
												{inv.status}
											</span>
										</td>
										<td className="px-4 py-3 text-[#ACB3BA]">
											{inv.created_at
												? new Date(inv.created_at).toLocaleDateString("en-GB")
												: "—"}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
