import { Link } from "@tanstack/react-router";
import { Building2, Clock, Users } from "lucide-react";
import type { Locale } from "~/lib/i18n";
import { localePath } from "~/lib/routing";
import { cn } from "~/lib/utils";

export interface ProjectCardData {
	id: string;
	slug: string;
	title: string;
	city: string;
	strategy: string;
	status: string;
	fundedPct: number;
	min_investment: number;
	projected_irr_min: number;
	projected_irr_max: number;
	target_amount: number;
	funded_amount: number;
	investor_count: number;
	estimated_duration_months: number;
	cover_images: string[];
	currency: string;
}

interface ProjectCardProps {
	project: ProjectCardData;
	locale: Locale;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
	fundraising: { label: "Fundraising", color: "bg-green-100 text-green-700" },
	funded: { label: "Funded", color: "bg-blue-100 text-blue-700" },
	in_execution: {
		label: "In Execution",
		color: "bg-purple-100 text-purple-700",
	},
	exiting: { label: "Exiting", color: "bg-amber-100 text-amber-700" },
	completed: { label: "Completed", color: "bg-gray-100 text-gray-700" },
};

const STRATEGY_LABELS: Record<string, string> = {
	flip: "Flip",
	buy_to_rent: "Buy to Rent",
	single_family: "Single Family",
	development: "Development",
};

function formatCurrency(amount: number, currency = "EUR") {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(amount);
}

export function ProjectCard({ project, locale }: ProjectCardProps) {
	const status = STATUS_LABELS[project.status] ?? {
		label: project.status,
		color: "bg-gray-100 text-gray-700",
	};

	return (
		<Link
			to={localePath(locale, `/projects/${project.slug}`)}
			data-testid="project-card"
			className="group flex flex-col rounded-2xl border border-border bg-white overflow-hidden hover:shadow-md transition-shadow"
		>
			{/* Cover image */}
			<div className="relative aspect-[4/3] bg-[#f8f9fa] overflow-hidden">
				{project.cover_images?.[0] ? (
					<img
						src={project.cover_images[0]}
						alt={project.title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<Building2 className="w-12 h-12 text-muted/40" />
					</div>
				)}

				{/* Status badge */}
				<div className="absolute top-3 left-3">
					<span
						className={cn(
							"px-2 py-0.5 rounded-full text-xs font-medium",
							status.color,
						)}
					>
						{status.label}
					</span>
				</div>

				{/* Funded pct badge */}
				<div className="absolute top-3 right-3">
					<span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary text-white">
						{project.fundedPct}%
					</span>
				</div>
			</div>

			{/* Card body */}
			<div className="flex flex-col flex-1 p-4">
				<div className="mb-3">
					<p className="text-xs text-muted mb-1">
						{STRATEGY_LABELS[project.strategy] ?? project.strategy} ·{" "}
						{project.city}
					</p>
					<h3 className="font-semibold text-text leading-tight line-clamp-2">
						{project.title}
					</h3>
				</div>

				{/* Progress bar */}
				<div className="mb-3">
					<div className="h-1.5 w-full bg-[#f0f2f5] rounded-full overflow-hidden">
						<div
							className="h-full bg-primary rounded-full transition-all"
							style={{ width: `${Math.min(project.fundedPct, 100)}%` }}
						/>
					</div>
				</div>

				{/* Key metrics */}
				<div className="grid grid-cols-3 gap-2 mt-auto pt-3 border-t border-border">
					<div>
						<p className="text-xs text-muted">Min. invest</p>
						<p className="text-sm font-semibold text-text">
							{formatCurrency(project.min_investment, project.currency)}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted">IRR</p>
						<p className="text-sm font-semibold text-text">
							{project.projected_irr_min}–{project.projected_irr_max}%
						</p>
					</div>
					<div>
						<p className="text-xs text-muted">Duration</p>
						<p className="text-sm font-semibold text-text">
							{project.estimated_duration_months}mo
						</p>
					</div>
				</div>

				{/* Investor count */}
				<div className="flex items-center gap-1 mt-2">
					<Users className="w-3 h-3 text-muted" />
					<span className="text-xs text-muted">
						{project.investor_count} investors
					</span>
					<Clock className="w-3 h-3 text-muted ml-auto" />
					<span className="text-xs text-muted">
						{project.estimated_duration_months} months
					</span>
				</div>
			</div>
		</Link>
	);
}
