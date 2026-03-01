import { createFileRoute } from "@tanstack/react-router";
import { Home, Search, ShoppingBag, Sofa } from "lucide-react";
import { AdvantageCards } from "~/components/marketing/advantage-cards";
import { CompanyLogos } from "~/components/marketing/company-logos";
import { CtaBanner } from "~/components/marketing/cta-banner";
import { EarnMore } from "~/components/marketing/earn-more";
import { EmailCta } from "~/components/marketing/email-cta";
import { FeatureSection } from "~/components/marketing/feature-section";
import { FeaturesGrid } from "~/components/marketing/features-grid";
import { Hero } from "~/components/marketing/hero";
import { HowItWorksHeader } from "~/components/marketing/how-it-works-header";
import { InvestSmarter } from "~/components/marketing/invest-smarter";
import { getLocaleFromParams } from "~/lib/routing";

export const Route = createFileRoute("/($locale)/(marketing)/")({
	beforeLoad: ({ params }) => {
		const locale = getLocaleFromParams((params as { locale?: string }).locale);
		return { locale };
	},
	component: function LandingPage() {
		return (
			<>
				<Hero />
				<FeaturesGrid />
				<HowItWorksHeader />

				{/* Feature 1: Explore */}
				<FeatureSection
					heading="Explore short-term rental investment opportunities"
					description="Browse curated Airbnb properties with detailed revenue data, occupancy rates, and neighborhood analytics to make informed decisions."
				>
					<div className="rounded-2xl bg-white border border-border shadow-sm p-6 min-h-[280px]">
						<div className="flex items-center gap-2 mb-4">
							<Search className="w-4 h-4 text-muted" />
							<div className="flex-1 h-8 rounded-lg bg-[#f8f9fa] border border-border" />
						</div>
						<div className="space-y-3">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f9fa]"
								>
									<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
										<Home className="w-5 h-5 text-primary/40" />
									</div>
									<div className="flex-1 space-y-1.5">
										<div className="h-3 w-3/4 rounded bg-border" />
										<div className="h-2.5 w-1/2 rounded bg-border/60" />
									</div>
								</div>
							))}
						</div>
					</div>
				</FeatureSection>

				{/* Feature 2: Purchase */}
				<FeatureSection
					heading="Purchase with Keyturn"
					description="We handle the entire acquisition process — from offer to closing. Our team negotiates the best deals and ensures a smooth transaction."
					reverse
				>
					<div className="rounded-2xl bg-gradient-to-br from-primary to-blue-600 min-h-[280px] flex items-center justify-center">
						<ShoppingBag className="w-16 h-16 text-white/30" />
					</div>
				</FeatureSection>

				{/* Feature 3: Design */}
				<FeatureSection
					heading="Design and furnish your Airbnb"
					description="Our professional interior designers create stunning, guest-ready spaces optimized for 5-star reviews and maximum bookings."
				>
					<div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 min-h-[280px] flex items-center justify-center">
						<Sofa className="w-16 h-16 text-amber-400/40" />
					</div>
				</FeatureSection>

				{/* Feature 4: Manage */}
				<FeatureSection
					heading="Manage with Keyturn"
					description="Full-service property management that maximizes your revenue while you focus on what matters."
					bulletPoints={[
						"Dynamic pricing optimization",
						"24/7 guest communication",
						"Professional cleaning and maintenance",
						"Monthly performance reporting",
					]}
					reverse
				>
					<div className="rounded-2xl bg-white border border-border shadow-sm p-6 min-h-[280px]">
						<div className="flex items-end justify-between gap-2 h-32 mb-4 px-2">
							{[40, 65, 50, 80, 55, 70, 85].map((h) => (
								<div
									key={h}
									className="flex-1 rounded-t-sm bg-primary/70"
									style={{ height: `${h}%` }}
								/>
							))}
						</div>
						<div className="space-y-2.5">
							{["Occupancy rate: 87%", "Revenue: $3,200/mo", "Rating: 4.9"].map(
								(text) => (
									<div
										key={text}
										className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#f8f9fa]"
									>
										<span className="text-xs text-muted">{text}</span>
									</div>
								),
							)}
						</div>
					</div>
				</FeatureSection>

				<InvestSmarter />
				<CtaBanner />
				<AdvantageCards />
				<EarnMore />
				<CompanyLogos />
				<EmailCta />
			</>
		);
	},
});
