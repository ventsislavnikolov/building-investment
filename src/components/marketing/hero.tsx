import { Link } from "@tanstack/react-router";
import type { Locale } from "~/lib/i18n";
import { localePath } from "~/lib/routing";

interface HeroProps {
	locale: Locale;
}

export function Hero({ locale }: HeroProps) {
	return (
		<section className="relative overflow-hidden bg-white pt-16 pb-24 sm:pt-24 sm:pb-32">
			{/* Background gradient */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
				<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full translate-y-1/2 -translate-x-1/2" />
			</div>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
					{/* Left: Text + CTA */}
					<div className="max-w-xl">
						<div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
								<span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
							</span>
							Now open for investors
						</div>

						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight tracking-tight">
							Investing in Bulgarian real estate has never been{" "}
							<span className="text-primary">easier.</span>
						</h1>

						<p className="mt-6 text-lg text-muted leading-relaxed">
							Access curated real estate investment opportunities in Bulgaria
							from as little as €500. Transparent returns, professional
							management, and full regulatory compliance.
						</p>

						<div className="mt-8 flex flex-col sm:flex-row gap-3">
							<form
								className="flex gap-2 flex-1"
								onSubmit={(e) => e.preventDefault()}
							>
								<input
									type="email"
									placeholder="Enter your email"
									className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
									aria-label="email address"
								/>
								<button
									type="submit"
									className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
								>
									Get access
								</button>
							</form>
						</div>

						<div className="mt-4 flex items-center gap-6">
							<Link
								to={localePath(locale, "/register")}
								className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
							>
								Get started
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<title>Arrow right</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
							<span className="text-xs text-muted">
								No credit card required
							</span>
						</div>
					</div>

					{/* Right: Dashboard mockup */}
					<div className="relative lg:ml-auto">
						<div className="relative rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden">
							{/* Mock dashboard UI */}
							<div className="bg-primary p-3">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-white/40" />
									<div className="w-2 h-2 rounded-full bg-white/40" />
									<div className="w-2 h-2 rounded-full bg-white/40" />
								</div>
							</div>
							<div className="p-6 space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs text-muted">Total invested</p>
										<p className="text-2xl font-bold text-text">€24,500</p>
									</div>
									<div className="text-right">
										<p className="text-xs text-muted">Portfolio return</p>
										<p className="text-xl font-bold text-green-600">+€2,940</p>
									</div>
								</div>
								<div className="h-px bg-border" />
								{[
									{
										name: "Sofia Residential Complex",
										irr: "12.4%",
										amount: "€5,000",
									},
									{
										name: "Plovdiv Commercial Hub",
										irr: "9.8%",
										amount: "€10,000",
									},
									{
										name: "Varna Beach Resort",
										irr: "14.2%",
										amount: "€9,500",
									},
								].map((project) => (
									<div
										key={project.name}
										className="flex items-center justify-between py-2"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
												<div className="w-3 h-3 rounded-sm bg-primary" />
											</div>
											<div>
												<p className="text-xs font-medium text-text truncate max-w-[150px]">
													{project.name}
												</p>
												<p className="text-xs text-muted">IRR {project.irr}</p>
											</div>
										</div>
										<p className="text-xs font-semibold text-text">
											{project.amount}
										</p>
									</div>
								))}
							</div>
						</div>
						{/* Floating badge */}
						<div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-border px-3 py-2">
							<p className="text-xs font-medium text-text">Avg. IRR</p>
							<p className="text-lg font-bold text-primary">12.1%</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
