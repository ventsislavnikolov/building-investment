import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, BookOpen, LineChart, Target } from "lucide-react";
import { AdvantageCards } from "~/components/marketing/advantage-cards";
import { CtaBanner } from "~/components/marketing/cta-banner";
import { EmailCta } from "~/components/marketing/email-cta";
import { FeatureSection } from "~/components/marketing/feature-section";
import { FeaturesGrid } from "~/components/marketing/features-grid";
import { Hero } from "~/components/marketing/hero";
import { StatsBar } from "~/components/marketing/stats-bar";
import { getLocaleFromParams } from "~/lib/routing";

export const Route = createFileRoute("/($locale)/(marketing)/")({
	beforeLoad: ({ params }) => {
		const locale = getLocaleFromParams((params as { locale?: string }).locale);
		return { locale };
	},
	component: function LandingPage() {
		const { locale } = Route.useRouteContext();
		return (
			<>
				<Hero locale={locale} />
				<StatsBar />
				<FeaturesGrid />
				<FeatureSection
					eyebrow="Browse projects"
					heading="Handpicked real estate opportunities"
					description="We source and vet every project — analyzing location, developer track record, legal compliance, and financial projections before it reaches you."
					icon={BookOpen}
				/>
				<FeatureSection
					eyebrow="Analyze returns"
					heading="Transparent financial modeling"
					description="Access detailed IRR calculations, cash flow projections, exit scenarios, and stress tests. Make informed decisions with complete data."
					icon={BarChart3}
					reverse
				/>
				<FeatureSection
					eyebrow="Invest securely"
					heading="Regulatory compliance built in"
					description="All investments are structured through regulated Bulgarian SPVs. Full KYC/AML compliance, notarized documents, and secure payment processing."
					icon={Target}
				/>
				<FeatureSection
					eyebrow="Track progress"
					heading="Your portfolio, always up to date"
					description="Monitor performance, receive distribution notifications, and access all documents from your investor dashboard. Full transparency, always."
					icon={LineChart}
					reverse
				/>
				<CtaBanner />
				<AdvantageCards />
				<EmailCta />
			</>
		);
	},
});
