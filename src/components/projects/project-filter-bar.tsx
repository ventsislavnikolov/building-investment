import { SlidersHorizontal } from "lucide-react";

interface ProjectFilterBarProps {
	total: number;
	shown: number;
	search: string;
	strategy: string;
	sort: string;
	onSearch: (v: string) => void;
	onStrategy: (v: string) => void;
	onSort: (v: string) => void;
	onOpenFilter: () => void;
}

const STRATEGIES = [
	{ value: "all", label: "All strategies" },
	{ value: "flip", label: "Flip" },
	{ value: "buy_to_rent", label: "Buy to Rent" },
	{ value: "development", label: "Development" },
	{ value: "single_family", label: "Single Family" },
];

const SORT_OPTIONS = [
	{ value: "featured", label: "Featured" },
	{ value: "funded_desc", label: "Most funded" },
	{ value: "irr_desc", label: "Highest IRR" },
];

export function ProjectFilterBar({
	total,
	shown,
	search,
	strategy,
	sort,
	onSearch,
	onStrategy,
	onSort,
	onOpenFilter,
}: ProjectFilterBarProps) {
	return (
		<div className="space-y-3">
			{/* Search row */}
			<div className="flex gap-2">
				<input
					type="search"
					value={search}
					onChange={(e) => onSearch(e.target.value)}
					placeholder="Search projects by city or name…"
					className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-white text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
					aria-label="search projects"
				/>
				<button
					type="button"
					className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
				>
					Search
				</button>
			</div>

			{/* Filter / sort row */}
			<div className="flex flex-wrap items-center gap-2">
				<p className="text-sm text-muted mr-auto">
					Viewing {shown} of {total} projects
				</p>

				<select
					value={strategy}
					onChange={(e) => onStrategy(e.target.value)}
					className="px-3 py-2 rounded-xl border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
					aria-label="filter by strategy"
				>
					{STRATEGIES.map((s) => (
						<option key={s.value} value={s.value}>
							{s.label}
						</option>
					))}
				</select>

				<select
					value={sort}
					onChange={(e) => onSort(e.target.value)}
					className="px-3 py-2 rounded-xl border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
					aria-label="sort projects"
				>
					{SORT_OPTIONS.map((s) => (
						<option key={s.value} value={s.value}>
							{s.label}
						</option>
					))}
				</select>

				<button
					type="button"
					data-testid="filter-button"
					onClick={onOpenFilter}
					className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-white text-sm text-muted hover:text-text hover:border-primary/40 transition-colors"
				>
					<SlidersHorizontal className="w-4 h-4" />
					Filters
				</button>
			</div>
		</div>
	);
}
