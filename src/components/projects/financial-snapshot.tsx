import { useFundingProgress } from "~/hooks/use-funding-progress";
import type { Locale } from "~/lib/i18n";
import type { ProjectCardData } from "./project-card";

interface FinancialSnapshotProps {
	project: ProjectCardData;
	locale: Locale;
}

function formatCurrency(amount: number, currency = "EUR") {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(amount);
}

export function FinancialSnapshot({ project }: FinancialSnapshotProps) {
	const live = useFundingProgress(project.id, {
		fundedAmount: project.funded_amount,
		targetAmount: project.target_amount,
		fundedPct: project.fundedPct,
	});

	const metrics = [
		{
			label: "Min. investment",
			value: formatCurrency(project.min_investment, project.currency),
		},
		{
			label: "Target IRR",
			value: `${project.projected_irr_min}–${project.projected_irr_max}%`,
		},
		{
			label: "Duration",
			value: `${project.estimated_duration_months} months`,
		},
		{ label: "Funded", value: `${live.fundedPct}%` },
		{
			label: "Investors",
			value: project.investor_count.toLocaleString(),
		},
		{
			label: "Target",
			value: formatCurrency(live.targetAmount, project.currency),
		},
	];

	return (
		<div className="rounded-2xl border border-border bg-white p-6">
			<h2 className="text-lg font-semibold text-text mb-4">
				Financial snapshot
			</h2>

			{/* Progress bar */}
			<div className="mb-5">
				<div className="flex items-center justify-between mb-1.5">
					<span className="text-sm text-muted">Funded</span>
					<span className="text-sm font-semibold text-primary">
						{live.fundedPct}%
					</span>
				</div>
				<div className="h-2 w-full bg-[#f0f2f5] rounded-full overflow-hidden">
					<div
						className="h-full bg-primary rounded-full"
						style={{ width: `${Math.min(live.fundedPct, 100)}%` }}
					/>
				</div>
				<div className="flex items-center justify-between mt-1">
					<span className="text-xs text-muted">
						{formatCurrency(live.fundedAmount, project.currency)} raised
					</span>
					<span className="text-xs text-muted">
						of {formatCurrency(live.targetAmount, project.currency)}
					</span>
				</div>
			</div>

			{/* Key metrics */}
			<div className="space-y-3">
				{metrics.map((metric) => (
					<div key={metric.label} className="flex items-center justify-between">
						<span className="text-sm text-muted">{metric.label}</span>
						<span className="text-sm font-semibold text-text">
							{metric.value}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
