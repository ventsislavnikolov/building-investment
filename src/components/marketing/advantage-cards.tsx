import { Clock, Star, TrendingUp } from "lucide-react";

const ADVANTAGES = [
	{
		icon: Star,
		title: "Find the best projects",
		description:
			"Every project is vetted by our expert team. We analyze location, developer track record, financial projections, and legal compliance before listing.",
	},
	{
		icon: TrendingUp,
		title: "Maximize returns",
		description:
			"Our curated portfolio targets 10-15% IRR. Access deal flow that was previously only available to institutional investors.",
	},
	{
		icon: Clock,
		title: "Save time",
		description:
			"Professional property management handles everything. You invest, we handle operations, reporting, and distributions.",
	},
];

export function AdvantageCards() {
	return (
		<section className="bg-[#f8f9fa] py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className="text-3xl sm:text-4xl font-bold text-text">
						Why investors choose us
					</h2>
				</div>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
					{ADVANTAGES.map((adv) => {
						const Icon = adv.icon;
						return (
							<div
								key={adv.title}
								className="bg-white rounded-2xl border border-border p-8 hover:shadow-md transition-shadow"
							>
								<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
									<Icon className="w-6 h-6 text-primary" />
								</div>
								<h3 className="text-xl font-semibold text-text mb-3">
									{adv.title}
								</h3>
								<p className="text-muted leading-relaxed text-sm">
									{adv.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
