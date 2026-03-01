import { Compass, Paintbrush, Search, ShoppingCart } from "lucide-react";

const FEATURES = [
	{
		icon: Search,
		title: "Find and analyze",
		description: "investment locations",
	},
	{
		icon: ShoppingCart,
		title: "Buy on airbnb site",
		description: "using Keyturn",
	},
	{
		icon: Compass,
		title: "Explore property",
		description: "investment options",
	},
	{
		icon: Paintbrush,
		title: "Use airbnb design",
		description: "assistance",
	},
];

export function FeaturesGrid() {
	return (
		<section className="bg-[#f8f9fa] py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{FEATURES.map((feature) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.title}
								className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
							>
								<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
									<Icon className="w-5 h-5 text-primary" />
								</div>
								<h3 className="text-lg font-semibold text-text mb-1">
									{feature.title}
								</h3>
								<p className="text-sm text-muted">{feature.description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
