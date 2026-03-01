import type { Locale } from "~/lib/i18n";

interface BillingSummaryProps {
	project: {
		title: string;
		city: string;
		coverImage?: string;
		projected_irr_min: number;
		projected_irr_max: number;
		min_investment: number;
		currency: string;
	};
	amount: number;
	termsAccepted: boolean;
	onTermsChange: (accepted: boolean) => void;
	onSubmit: () => void;
	isSubmitting: boolean;
	locale: Locale;
}

const PLATFORM_FEE_PCT = 1.5;

function fmt(n: number, currency: string) {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(n);
}

export function BillingSummary({
	project,
	amount,
	termsAccepted,
	onTermsChange,
	onSubmit,
	isSubmitting,
}: BillingSummaryProps) {
	const platformFee = Math.round(amount * (PLATFORM_FEE_PCT / 100));
	const total = amount + platformFee;
	const isBelowMin = amount < project.min_investment;
	const canSubmit = termsAccepted && !isBelowMin && !isSubmitting;

	return (
		<div className="rounded-2xl bg-[#cee8fb] p-6 space-y-5">
			<h2 className="text-lg font-semibold text-text">Investment Summary</h2>

			{/* Project info */}
			<div className="flex items-start gap-3">
				{project.coverImage ? (
					<img
						src={project.coverImage}
						alt={project.title}
						className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
					/>
				) : (
					<div className="w-16 h-16 rounded-xl bg-primary/10 flex-shrink-0" />
				)}
				<div>
					<p className="font-semibold text-text text-sm">{project.title}</p>
					<p className="text-xs text-muted">{project.city}, Bulgaria</p>
					<p className="text-xs text-muted mt-0.5">
						IRR: {project.projected_irr_min}–{project.projected_irr_max}%
					</p>
				</div>
			</div>

			{/* Fee breakdown */}
			<div className="space-y-2 text-sm">
				<div className="flex justify-between">
					<span className="text-muted">Amount</span>
					<span className="font-medium text-text">
						{fmt(amount, project.currency)}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted">Platform fee ({PLATFORM_FEE_PCT}%)</span>
					<span className="font-medium text-text">
						{fmt(platformFee, project.currency)}
					</span>
				</div>
				<div className="flex justify-between border-t border-[#b3d4f5] pt-2">
					<span className="font-semibold text-text">Total</span>
					<span className="font-bold text-primary text-base">
						{fmt(total, project.currency)}
					</span>
				</div>
			</div>

			{/* Terms */}
			<label className="flex items-start gap-2 cursor-pointer">
				<input
					type="checkbox"
					checked={termsAccepted}
					onChange={(e) => onTermsChange(e.target.checked)}
					className="mt-0.5 accent-primary"
					aria-label="accept terms and conditions"
				/>
				<span className="text-xs text-muted leading-relaxed">
					I have read and agree to the{" "}
					<a
						href="/terms"
						className="text-primary underline"
						target="_blank"
						rel="noreferrer"
					>
						Terms &amp; Conditions
					</a>{" "}
					and{" "}
					<a
						href="/risk"
						className="text-primary underline"
						target="_blank"
						rel="noreferrer"
					>
						Risk Disclosure
					</a>
					.
				</span>
			</label>

			{/* CTA */}
			<button
				type="button"
				onClick={onSubmit}
				disabled={!canSubmit}
				className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold text-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isSubmitting ? "Processing…" : "Complete Investment"}
			</button>
		</div>
	);
}
