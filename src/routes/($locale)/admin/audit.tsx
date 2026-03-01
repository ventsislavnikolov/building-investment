import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";

const getAuditLogs = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseAdminClient();
	const { data } = await supabase
		.from("audit_logs")
		.select("id, table_name, record_id, action, changed_by, created_at")
		.order("created_at", { ascending: false })
		.limit(100);
	return data ?? [];
});

const ACTION_COLORS: Record<string, string> = {
	INSERT: "bg-green-100 text-green-700",
	UPDATE: "bg-blue-100 text-blue-700",
	DELETE: "bg-red-100 text-red-700",
};

export const Route = createFileRoute("/($locale)/admin/audit")({
	loader: async () => {
		const logs = await getAuditLogs();
		return { logs };
	},
	component: function AuditPage() {
		const { logs } = Route.useLoaderData();

		return (
			<div className="space-y-6 max-w-5xl">
				<div>
					<h1 className="text-2xl font-bold text-text">Audit Log</h1>
					<p className="text-muted mt-1">Last 100 actions</p>
				</div>

				{logs.length === 0 ? (
					<div className="rounded-2xl border border-border bg-white p-8 text-center">
						<p className="text-muted">No audit entries.</p>
					</div>
				) : (
					<div className="rounded-2xl border border-border bg-white overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="border-b border-border bg-[#f8f9fa]">
									<tr>
										<th className="text-left px-5 py-3 font-medium text-muted">
											Table
										</th>
										<th className="text-left px-5 py-3 font-medium text-muted">
											Record ID
										</th>
										<th className="text-left px-5 py-3 font-medium text-muted">
											Action
										</th>
										<th className="text-left px-5 py-3 font-medium text-muted">
											Changed by
										</th>
										<th className="text-right px-5 py-3 font-medium text-muted">
											Timestamp
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border">
									{logs.map((log) => (
										<tr
											key={log.id}
											className="hover:bg-[#f8f9fa] transition-colors"
										>
											<td className="px-5 py-3 font-mono text-xs text-muted">
												{log.table_name}
											</td>
											<td className="px-5 py-3 font-mono text-xs text-muted truncate max-w-[120px]">
												{log.record_id}
											</td>
											<td className="px-5 py-3">
												<span
													className={`px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_COLORS[log.action] ?? "bg-gray-100 text-gray-700"}`}
												>
													{log.action}
												</span>
											</td>
											<td className="px-5 py-3 text-muted font-mono text-xs truncate max-w-[120px]">
												{log.changed_by ?? "system"}
											</td>
											<td className="px-5 py-3 text-right text-muted">
												{new Date(log.created_at).toLocaleString("en-GB")}
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
