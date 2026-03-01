import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner } from "~/components/marketing/cta-banner";
import { getLocaleFromParams } from "~/lib/routing";

const VALUES = [
	{
		title: "Transparency",
		description:
			"Every fee, every return, every risk — openly disclosed. No hidden charges, no surprises.",
	},
	{
		title: "Accessibility",
		description:
			"Real estate investment starting from €500. We believe wealth building shouldn't be exclusive.",
	},
	{
		title: "Expertise",
		description:
			"Our team has 20+ years of combined experience in Bulgarian real estate, finance, and technology.",
	},
	{
		title: "Compliance",
		description:
			"Fully regulated under Bulgarian financial law. Your investments are protected by law and industry best practices.",
	},
];

export const Route = createFileRoute("/($locale)/_marketing/about")({
	beforeLoad: ({ params }) => {
		const locale = getLocaleFromParams((params as { locale?: string }).locale);
		return { locale };
	},
	component: function AboutPage() {
		return (
			<>
				{/* Mission */}
				<section className="bg-white pt-16 pb-24 sm:pt-24 sm:pb-32">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="max-w-3xl">
							<p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
								About us
							</p>
							<h1 className="text-4xl sm:text-5xl font-bold text-text mb-6">
								Making Bulgarian real estate investment accessible to everyone
							</h1>
							<p className="text-muted text-lg leading-relaxed">
								We started BuildInvest because we saw a gap: great real estate
								opportunities in Bulgaria, but access limited to those with
								large capital and industry connections. We're changing that —
								bringing institutional-quality deals to everyday investors, with
								full transparency and regulatory compliance.
							</p>
						</div>
					</div>
				</section>

				{/* Values */}
				<section className="bg-[#f8f9fa] py-16 sm:py-24">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-bold text-text mb-12">Our values</h2>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{VALUES.map((value) => (
								<div
									key={value.title}
									className="bg-white rounded-2xl border border-border p-6"
								>
									<h3 className="text-lg font-semibold text-text mb-3">
										{value.title}
									</h3>
									<p className="text-sm text-muted leading-relaxed">
										{value.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Team */}
				<section className="bg-white py-16 sm:py-24">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-bold text-text mb-12">Our team</h2>
						<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
							{[
								{
									name: "Georgi Petrov",
									role: "CEO & Co-founder",
									bio: "10+ years in Bulgarian real estate development and investment.",
								},
								{
									name: "Maria Ivanova",
									role: "CTO & Co-founder",
									bio: "Former fintech engineer. Built platforms processing €1B+ annually.",
								},
								{
									name: "Stefan Nikolov",
									role: "Head of Investments",
									bio: "CFA. Previously managed €200M real estate portfolio at major Bulgarian bank.",
								},
							].map((member) => (
								<div key={member.name} className="flex items-start gap-4">
									<div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
										<span className="text-xl font-bold text-primary">
											{member.name[0]}
										</span>
									</div>
									<div>
										<p className="font-semibold text-text">{member.name}</p>
										<p className="text-sm text-primary mb-2">{member.role}</p>
										<p className="text-sm text-muted">{member.bio}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<CtaBanner />
			</>
		);
	},
});
