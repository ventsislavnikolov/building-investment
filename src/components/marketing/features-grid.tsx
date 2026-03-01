import { BarChart3, Search, Shield, TrendingUp } from "lucide-react";
import { cn } from "~/lib/utils";

const FEATURES = [
	{
		icon: Search,
		title: "Discover",
		description:
			"Browse curated real estate investment opportunities across Bulgaria.",
		highlight: true,
	},
	{
		icon: BarChart3,
		title: "Analyze",
		description:
			"Access detailed financial projections, IRR calculations, and risk assessments.",
		highlight: false,
	},
	{
		icon: Shield,
		title: "Invest",
		description:
			"Invest securely with regulatory compliance and full documentation.",
		highlight: false,
	},
	{
		icon: TrendingUp,
		title: "Track",
		description:
			"Monitor your portfolio performance and receive regular distributions.",
		highlight: false,
	},
];

export function FeaturesGrid() {
	return (
		<section className="bg-[#f8f9fa] py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className="text-3xl sm:text-4xl font-bold text-text">
						Everything you need to invest smarter
					</h2>
					<p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
						From discovery to distribution — a complete platform for real estate
						investors.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{FEATURES.map((feature) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.title}
								className={cn(
									"rounded-2xl p-6 transition-shadow hover:shadow-md",
									feature.highlight
										? "bg-primary text-white"
										: "bg-white border border-border",
								)}
							>
								<div
									className={cn(
										"w-10 h-10 rounded-xl flex items-center justify-center mb-4",
										feature.highlight ? "bg-white/20" : "bg-primary/10",
									)}
								>
									<Icon
										className={cn(
											"w-5 h-5",
											feature.highlight ? "text-white" : "text-primary",
										)}
									/>
								</div>
								<h3
									className={cn(
										"text-lg font-semibold mb-2",
										feature.highlight ? "text-white" : "text-text",
									)}
								>
									{feature.title}
								</h3>
								<p
									className={cn(
										"text-sm leading-relaxed",
										feature.highlight ? "text-white/80" : "text-muted",
									)}
								>
									{feature.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
