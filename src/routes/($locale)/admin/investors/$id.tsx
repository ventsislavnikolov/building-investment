import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";

const getAdminInvestor = createServerFn({ method: "GET" })
	.inputValidator((d: { id: string }) => d)
	.handler(async ({ data }) => {
		const supabase = createSupabaseAdminClient();

		const { data: profile } = await supabase
			.from("profiles")
			.select(
				"id, full_name, email, kyc_status, role, created_at, phone, nationality",
			)
			.eq("id", data.id)
			.single();

		const { data: investments } = await supabase
			.from("investments")
			.select(
				"id, amount, status, total_returned, created_at, projects(title, slug)",
			)
			.eq("investor_id", data.id)
			.order("created_at", { ascending: false });

		const totalInvested =
			investments?.reduce((sum, i) => sum + (i.amount ?? 0), 0) ?? 0;
		const totalReturned =
			investments?.reduce((sum, i) => sum + (i.total_returned ?? 0), 0) ?? 0;

		return {
			profile,
			investments: investments ?? [],
			totalInvested,
			totalReturned,
		};
	});

export const Route = createFileRoute("/(locale)/admin/investors/$id" as never)({
	loader: ({ params }) => getAdminInvestor({ data: { id: params.id } }),
	component: AdminInvestorDetailPage,
});

const KYC_COLORS: Record<string, string> = {
	not_started: "bg-gray-100 text-gray-700",
	pending: "bg-yellow-100 text-yellow-700",
	approved: "bg-green-100 text-green-700",
	rejected: "bg-red-100 text-red-700",
};

function AdminInvestorDetailPage() {
	const { profile, investments, totalInvested, totalReturned } =
		Route.useLoaderData();

	if (!profile) {
		return (
			<div className="p-6">
				<p className="text-[#ACB3BA]">Investor not found.</p>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Link
					to="/(locale)/admin/investors"
					className="text-[#ACB3BA] hover:text-[#151515] transition-colors"
				>
					<ArrowLeft className="w-5 h-5" />
				</Link>
				<div className="flex-1">
					<h1 className="text-2xl font-bold text-[#151515]">
						{profile.full_name ?? "Unnamed investor"}
					</h1>
					<p className="text-sm text-[#ACB3BA]">{profile.email}</p>
				</div>
				<span
					className={`px-3 py-1 rounded-full text-xs font-semibold ${KYC_COLORS[profile.kyc_status ?? "not_started"]}`}
				>
					KYC: {profile.kyc_status ?? "not_started"}
				</span>
			</div>

			{/* Profile card */}
			<div className="bg-white rounded-2xl border border-[#EEF2F6] p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
				{[
					{ label: "Phone", value: profile.phone ?? "—" },
					{ label: "Nationality", value: profile.nationality ?? "—" },
					{ label: "Role", value: profile.role ?? "investor" },
					{
						label: "Joined",
						value: profile.created_at
							? new Date(profile.created_at).toLocaleDateString("en-GB")
							: "—",
					},
				].map(({ label, value }) => (
					<div key={label}>
						<p className="text-xs text-[#ACB3BA] uppercase tracking-wide mb-1">
							{label}
						</p>
						<p className="font-medium text-[#151515]">{value}</p>
					</div>
				))}
			</div>

			{/* KPIs */}
			<div className="grid grid-cols-3 gap-4">
				{[
					{ label: "Investments", value: investments.length },
					{
						label: "Total Invested",
						value: `€${totalInvested.toLocaleString()}`,
					},
					{
						label: "Total Returned",
						value: `€${totalReturned.toLocaleString()}`,
					},
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

			{/* Investment history */}
			<div className="bg-white rounded-2xl border border-[#EEF2F6] overflow-hidden">
				<div className="px-5 py-4 border-b border-[#EEF2F6]">
					<h2 className="font-semibold text-[#151515]">Investment History</h2>
				</div>
				{investments.length === 0 ? (
					<p className="p-5 text-sm text-[#ACB3BA]">No investments yet.</p>
				) : (
					<table className="w-full text-sm">
						<thead className="bg-[#EEF2F6] text-[#ACB3BA] uppercase text-xs">
							<tr>
								<th className="text-left px-4 py-3">Project</th>
								<th className="text-right px-4 py-3">Amount</th>
								<th className="text-right px-4 py-3">Returned</th>
								<th className="text-left px-4 py-3">Status</th>
								<th className="text-left px-4 py-3">Date</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[#EEF2F6]">
							{investments.map((inv) => {
								const project = inv.projects as {
									title: string;
									slug: string;
								} | null;
								return (
									<tr key={inv.id} className="hover:bg-[#EEF2F6]/40">
										<td className="px-4 py-3 font-medium text-[#151515]">
											{project ? (
												<Link
													to={`/projects/${project.slug}`}
													className="hover:text-[#1B59E8] hover:underline"
												>
													{project.title}
												</Link>
											) : (
												"—"
											)}
										</td>
										<td className="px-4 py-3 text-right">
											€{inv.amount?.toLocaleString()}
										</td>
										<td className="px-4 py-3 text-right text-green-600">
											€{inv.total_returned?.toLocaleString() ?? 0}
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
