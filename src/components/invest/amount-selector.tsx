import { useId } from "react";

interface AmountSelectorProps {
	amount: number;
	minAmount: number;
	maxAmount: number;
	currency: string;
	onChange: (value: number) => void;
}

function fmt(n: number, currency: string) {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(n);
}

export function AmountSelector({
	amount,
	minAmount,
	maxAmount,
	currency,
	onChange,
}: AmountSelectorProps) {
	const uid = useId();
	const inputId = `${uid}-amount`;
	const isBelowMin = amount < minAmount;

	const presets = [
		{ label: "Min", value: minAmount },
		{
			label: "Mid",
			value: Math.round((minAmount + maxAmount) / 2 / 100) * 100,
		},
		{ label: "Max", value: maxAmount },
	];

	return (
		<div className="space-y-4">
			<div>
				<label
					htmlFor={inputId}
					className="block text-sm font-medium text-text mb-1.5"
				>
					Investment amount
				</label>
				<div className="relative">
					<span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">
						{currency === "EUR" ? "€" : currency}
					</span>
					<input
						id={inputId}
						type="number"
						min={minAmount}
						max={maxAmount}
						step={100}
						value={amount}
						onChange={(e) => onChange(Number(e.target.value))}
						className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
					/>
				</div>
				{isBelowMin && (
					<p className="mt-1 text-xs text-destructive">
						Amount below minimum of {fmt(minAmount, currency)}
					</p>
				)}
				{!isBelowMin && (
					<p className="mt-1 text-xs text-muted">
						Minimum: {fmt(minAmount, currency)}
					</p>
				)}
			</div>

			{/* Preset buttons */}
			<div className="flex gap-2">
				{presets.map((p) => (
					<button
						key={p.label}
						type="button"
						onClick={() => onChange(p.value)}
						className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
							amount === p.value
								? "bg-primary text-white border-primary"
								: "bg-white text-text border-border hover:border-primary hover:text-primary"
						}`}
					>
						{p.label}
						<span className="block text-xs font-normal mt-0.5 opacity-70">
							{fmt(p.value, currency)}
						</span>
					</button>
				))}
			</div>

			{/* Slider */}
			<input
				type="range"
				min={minAmount}
				max={maxAmount}
				step={100}
				value={Math.max(minAmount, Math.min(maxAmount, amount))}
				onChange={(e) => onChange(Number(e.target.value))}
				className="w-full accent-primary"
				aria-label="investment amount slider"
			/>
		</div>
	);
}
