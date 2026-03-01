import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Bell } from "lucide-react";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const getNotifications = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("Unauthenticated");

	const { data } = await supabase
		.from("notifications")
		.select("id, type, title, body, is_read, created_at")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false })
		.limit(50);

	return data ?? [];
});

export const Route = createFileRoute("/($locale)/dashboard/notifications")({
	loader: async () => {
		const notifications = await getNotifications();
		return { notifications };
	},
	component: function NotificationsPage() {
		const { notifications } = Route.useLoaderData();
		const unread = notifications.filter((n) => !n.is_read).length;

		return (
			<div className="space-y-6 max-w-2xl">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-text">Notifications</h1>
						<p className="text-muted mt-1">
							{unread > 0 ? `${unread} unread` : "All caught up"}
						</p>
					</div>
				</div>

				{notifications.length === 0 ? (
					<div className="rounded-2xl border border-border bg-white p-8 text-center">
						<Bell className="w-10 h-10 text-muted mx-auto mb-3" />
						<p className="text-text font-medium">No notifications</p>
					</div>
				) : (
					<div className="rounded-2xl border border-border bg-white divide-y divide-border overflow-hidden">
						{notifications.map((n) => (
							<div
								key={n.id}
								className={`px-5 py-4 flex items-start gap-3 ${!n.is_read ? "bg-[#f0f6ff]" : ""}`}
							>
								<div
									className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.is_read ? "bg-primary" : "bg-transparent"}`}
								/>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-text">{n.title}</p>
									{n.body && (
										<p className="text-sm text-muted mt-0.5">{n.body}</p>
									)}
									<p className="text-xs text-muted mt-1">
										{new Date(n.created_at).toLocaleString("en-GB")}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		);
	},
});
