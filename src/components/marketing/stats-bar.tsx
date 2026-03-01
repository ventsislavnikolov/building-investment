const STATS = [
	{ value: "€12M+", label: "Total invested" },
	{ value: "840+", label: "Active investors" },
	{ value: "12.1%", label: "Avg. IRR" },
	{ value: "24", label: "Projects funded" },
];

export function StatsBar() {
	return (
		<section className="bg-primary">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
					{STATS.map((stat) => (
						<div key={stat.label} className="text-center">
							<p className="text-2xl sm:text-3xl font-bold text-white">
								{stat.value}
							</p>
							<p className="mt-1 text-sm text-white/70">{stat.label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
