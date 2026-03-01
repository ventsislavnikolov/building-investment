import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "~/lib/supabase/client";

export function useNotifications(userId: string | null) {
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		if (!userId) return;
		const supabase = createSupabaseBrowserClient();

		// Load initial unread count
		supabase
			.from("notifications")
			.select("id", { count: "exact", head: true })
			.eq("user_id", userId)
			.eq("is_read", false)
			.then(({ count }) => setUnreadCount(count ?? 0));

		// Subscribe to new notifications
		const channel = supabase
			.channel(`notifications-${userId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "notifications",
					filter: `user_id=eq.${userId}`,
				},
				() => setUnreadCount((c) => c + 1),
			)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "notifications",
					filter: `user_id=eq.${userId}`,
				},
				(payload) => {
					const updated = payload.new as { is_read: boolean };
					if (updated.is_read) {
						setUnreadCount((c) => Math.max(0, c - 1));
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [userId]);

	return { unreadCount };
}
