import { Clock, Home } from "lucide-react";
import { SectionHeading } from "./section-heading";

const ADVANTAGES = [
	{
		title: "Invest in the best properties",
		description:
			"Every property is vetted by our expert team. We analyze location, revenue potential, and market trends before listing.",
		visual: (
			<div className="bg-gradient-to-br from-blue-100 to-blue-50 h-48 flex items-center justify-center">
				<Home className="w-12 h-12 text-primary/40" />
			</div>
		),
	},
	{
		title: "Save time and energy",
		description:
			"Professional property management handles everything — from guest communication to cleaning and maintenance.",
		visual: (
			<div className="bg-gradient-to-br from-amber-50 to-orange-50 h-48 flex items-center justify-center">
				<Clock className="w-12 h-12 text-amber-400/60" />
			</div>
		),
	},
	{
		title: "Average Monthly Rental Revenue",
		description:
			"Our properties consistently outperform market averages with data-driven pricing and optimized listings.",
		visual: (
			<div className="bg-white h-48 flex items-end justify-center gap-2 px-6 pb-6 pt-4">
				{[40, 65, 50, 80, 60, 90, 75].map((h) => (
					<div
						key={h}
						className="flex-1 rounded-t-md bg-primary/80"
						style={{ height: `${h}%` }}
					/>
				))}
			</div>
		),
	},
];

export function AdvantageCards() {
	return (
		<section className="bg-[#f8f9fa] py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-12">
					<SectionHeading
						preText="The Keyturn"
						highlightText="advantage"
						subtitle="Everything you need to invest in short-term rentals with confidence."
					/>
				</div>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
					{ADVANTAGES.map((adv) => (
						<div
							key={adv.title}
							className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow"
						>
							{adv.visual}
							<div className="p-6">
								<h3 className="text-lg font-semibold text-text mb-2">
									{adv.title}
								</h3>
								<p className="text-sm text-muted leading-relaxed">
									{adv.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
