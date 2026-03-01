import { TrendingDown, TrendingUp } from "lucide-react";

interface KpiCardProps {
	label: string;
	value: string;
	trend?: string;
	trendUp?: boolean;
	icon?: React.ReactNode;
}

export function KpiCard({ label, value, trend, trendUp, icon }: KpiCardProps) {
	return (
		<div className="rounded-2xl border border-border bg-white p-5">
			<div className="flex items-start justify-between">
				<p className="text-sm text-muted">{label}</p>
				{icon && (
					<span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
						{icon}
					</span>
				)}
			</div>
			<p className="text-2xl font-bold text-text mt-2">{value}</p>
			{trend && (
				<div
					className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trendUp ? "text-success" : "text-destructive"}`}
				>
					{trendUp ? (
						<TrendingUp className="w-3 h-3" />
					) : (
						<TrendingDown className="w-3 h-3" />
					)}
					{trend}
				</div>
			)}
		</div>
	);
}
