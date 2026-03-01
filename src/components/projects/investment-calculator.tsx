import { Link } from "@tanstack/react-router";
import { useId, useState } from "react";
import type { Locale } from "~/lib/i18n";
import { localePath } from "~/lib/routing";

interface InvestmentCalculatorProps {
	project: {
		slug: string;
		min_investment: number;
		target_amount: number;
		projected_irr_min: number;
		projected_irr_max: number;
		estimated_duration_months: number;
		currency: string;
	};
	locale: Locale;
}

function calcReturn(amount: number, irrPct: number, months: number) {
	const years = months / 12;
	return amount * ((1 + irrPct / 100) ** years - 1);
}

export function InvestmentCalculator({
	project,
	locale,
}: InvestmentCalculatorProps) {
	const uid = useId();
	const inputId = `${uid}-amount`;
	const [amount, setAmount] = useState(project.min_investment);

	const minReturn = calcReturn(
		amount,
		project.projected_irr_min,
		project.estimated_duration_months,
	);
	const maxReturn = calcReturn(
		amount,
		project.projected_irr_max,
		project.estimated_duration_months,
	);

	const fmt = (n: number) =>
		new Intl.NumberFormat("en-EU", {
			style: "currency",
			currency: project.currency,
			maximumFractionDigits: 0,
		}).format(n);

	return (
		<div className="rounded-2xl border border-border bg-white p-6">
			<h2 className="text-lg font-semibold text-text mb-4">
				Investment calculator
			</h2>

			<div className="space-y-4">
				<div>
					<label
						htmlFor={inputId}
						className="block text-sm font-medium text-text mb-1.5"
					>
						Investment amount
					</label>
					<input
						id={inputId}
						type="number"
						min={project.min_investment}
						max={project.target_amount}
						step={100}
						value={amount}
						onChange={(e) =>
							setAmount(
								Math.max(project.min_investment, Number(e.target.value)),
							)
						}
						className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
					/>
					<p className="mt-1 text-xs text-muted">
						Minimum: {fmt(project.min_investment)}
					</p>
				</div>

				<div className="rounded-xl bg-[#f8f9fa] p-4 space-y-3">
					<div className="flex justify-between">
						<span className="text-sm text-muted">Projected return (min)</span>
						<span className="text-sm font-semibold text-text">
							+{fmt(minReturn)}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-sm text-muted">Projected return (max)</span>
						<span className="text-sm font-bold text-primary">
							+{fmt(maxReturn)}
						</span>
					</div>
					<div className="flex justify-between border-t border-border pt-3">
						<span className="text-sm text-muted">Total (max)</span>
						<span className="text-sm font-bold text-text">
							{fmt(amount + maxReturn)}
						</span>
					</div>
				</div>

				<Link
					to={localePath(locale, `/projects/${project.slug}/invest`)}
					className="block w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold text-center hover:bg-primary/90 transition-colors"
				>
					Invest now
				</Link>
			</div>
		</div>
	);
}
