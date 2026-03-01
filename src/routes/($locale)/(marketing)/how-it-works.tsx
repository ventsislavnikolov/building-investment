import { createFileRoute } from "@tanstack/react-router";
import { EmailCta } from "~/components/marketing/email-cta";
import { HowItWorksSteps } from "~/components/marketing/how-it-works-steps";
import { getLocaleFromParams } from "~/lib/routing";

export const Route = createFileRoute("/($locale)/(marketing)/how-it-works")({
	beforeLoad: ({ params }) => {
		const locale = getLocaleFromParams((params as { locale?: string }).locale);
		return { locale };
	},
	component: function HowItWorksPage() {
		return (
			<>
				<section className="bg-white pt-16 pb-24 sm:pt-24 sm:pb-32">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						{/* Header */}
						<div className="max-w-2xl mb-16">
							<p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
								How it works
							</p>
							<h1 className="text-4xl sm:text-5xl font-bold text-text mb-4">
								Start investing in 4 simple steps
							</h1>
							<p className="text-muted text-lg leading-relaxed">
								From registration to your first return — we've made the process
								as simple as possible so you can focus on building wealth.
							</p>
						</div>

						{/* Steps */}
						<div className="max-w-2xl">
							<HowItWorksSteps />
						</div>
					</div>
				</section>
				<EmailCta />
			</>
		);
	},
});
