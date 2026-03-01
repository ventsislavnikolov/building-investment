const STATS = [
	{ value: "25%", label: "Avg. ROI" },
	{ value: "40 hrs/mo", label: "Time saved" },
	{ value: "$2,400", label: "Avg. monthly revenue" },
];

export function EarnMore() {
	return (
		<section className="py-16 sm:py-24 bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left: Heading + description */}
					<div>
						<h2 className="text-3xl sm:text-4xl font-bold text-text">
							Earn more,
							<br />
							work less
						</h2>
						<p className="mt-4 text-muted text-lg leading-relaxed">
							Keyturn investors consistently outperform self-managed properties
							with less effort, thanks to our data-driven approach and
							professional management.
						</p>
					</div>

					{/* Right: Stats card */}
					<div className="bg-slate-900 rounded-2xl p-8">
						<div className="grid grid-cols-3 gap-6">
							{STATS.map((stat) => (
								<div key={stat.label} className="text-center">
									<p className="text-2xl sm:text-3xl font-bold text-white">
										{stat.value}
									</p>
									<p className="mt-1 text-xs text-slate-400">{stat.label}</p>
								</div>
							))}
						</div>
						{/* Mini chart decoration */}
						<div className="mt-6 flex items-end gap-1.5 h-16 px-4">
							{[30, 45, 35, 55, 50, 70, 60, 80, 75, 90, 85, 95].map((h) => (
								<div
									key={h}
									className="flex-1 rounded-t-sm bg-primary/60"
									style={{ height: `${h}%` }}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
