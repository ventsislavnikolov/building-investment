import { CheckCircle, TrendingUp } from "lucide-react";

const BULLETS = [
	"Access real-time financial data and analytics",
	"Compare properties with market benchmarks",
	"Get personalized revenue projections",
	"Track your investment performance",
];

export function InvestSmarter() {
	return (
		<section className="py-16 sm:py-24 bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="rounded-2xl bg-gradient-to-r from-primary to-blue-600 p-8 lg:p-12">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
						{/* Left: CSS bar chart with trend arrow */}
						<div className="relative">
							<div className="flex items-end justify-center gap-3 h-48 px-4">
								{[30, 50, 40, 65, 45, 75, 55, 85].map((h) => (
									<div
										key={h}
										className="flex-1 max-w-10 rounded-t-md bg-white/20 hover:bg-white/30 transition-colors"
										style={{ height: `${h}%` }}
									/>
								))}
							</div>
							{/* Trend arrow */}
							<div className="absolute top-4 right-4">
								<TrendingUp className="w-8 h-8 text-white/40" />
							</div>
						</div>

						{/* Right: Text + bullets */}
						<div>
							<h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
								Invest smarter with Keyturn
							</h2>
							<ul className="space-y-4">
								{BULLETS.map((bullet) => (
									<li key={bullet} className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-white/80 shrink-0 mt-0.5" />
										<span className="text-white/90 text-sm">{bullet}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
