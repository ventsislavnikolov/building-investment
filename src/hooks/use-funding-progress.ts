import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "~/lib/supabase/client";

interface FundingProgress {
	fundedAmount: number;
	targetAmount: number;
	fundedPct: number;
}

export function useFundingProgress(
	projectId: string,
	initial: FundingProgress,
): FundingProgress {
	const [progress, setProgress] = useState<FundingProgress>(initial);

	useEffect(() => {
		const supabase = createSupabaseBrowserClient();

		const channel = supabase
			.channel(`project-${projectId}`)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "projects",
					filter: `id=eq.${projectId}`,
				},
				(payload) => {
					const updated = payload.new as {
						funded_amount: number;
						target_amount: number;
					};
					const fundedPct =
						updated.target_amount > 0
							? Math.round(
									(updated.funded_amount / updated.target_amount) * 100,
								)
							: 0;
					setProgress({
						fundedAmount: updated.funded_amount,
						targetAmount: updated.target_amount,
						fundedPct,
					});
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [projectId]);

	return progress;
}
