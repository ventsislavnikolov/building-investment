import { createServerFn } from "@tanstack/react-start";
import { createSupabaseServerClient } from "~/lib/supabase/server";

export const getDashboardSummary = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = createSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) throw new Error("Unauthenticated");

		const { data: investments } = await supabase
			.from("investments")
			.select("amount, total_returned, status")
			.eq("investor_id", user.id)
			.in("status", ["active", "returning", "exited"]);

		const active =
			investments?.filter((i) => i.status === "active").length ?? 0;
		const totalInvested =
			investments?.reduce((sum, i) => sum + i.amount, 0) ?? 0;
		const totalReturned =
			investments?.reduce((sum, i) => sum + (i.total_returned ?? 0), 0) ?? 0;

		return {
			activeInvestments: active,
			totalInvested,
			totalReturned,
			netExposure: totalInvested - totalReturned,
		};
	},
);
