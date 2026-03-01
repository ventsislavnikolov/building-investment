import { Home } from "lucide-react";

export function EmailCta() {
	return (
		<section className="bg-primary py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left: Text + form */}
					<div>
						<h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
							Looking for great investment opportunities?
						</h2>
						<p className="text-white/80 text-lg mb-8">
							Join investors already building wealth through short-term rental
							properties. Get early access to new listings.
						</p>
						<form
							className="flex flex-col sm:flex-row gap-3 max-w-md"
							onSubmit={(e) => e.preventDefault()}
							aria-label="email signup"
						>
							<input
								type="email"
								placeholder="your@email.com"
								className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
								aria-label="email address"
							/>
							<button
								type="submit"
								className="px-6 py-3 rounded-xl bg-white text-primary text-sm font-semibold hover:bg-white/90 transition-colors shrink-0"
							>
								Sign Up
							</button>
						</form>
						<p className="mt-3 text-xs text-white/50">
							No spam. Unsubscribe anytime.
						</p>
					</div>

					{/* Right: Overlapping property cards */}
					<div className="relative h-[320px] hidden lg:block">
						{/* Card 1 */}
						<div className="absolute top-0 right-0 w-64 bg-white rounded-2xl shadow-xl overflow-hidden">
							<div className="h-32 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
								<Home className="w-8 h-8 text-primary/30" />
							</div>
							<div className="p-4">
								<p className="text-sm font-semibold text-text">
									Beachfront Villa
								</p>
								<p className="text-xs text-muted mt-1">$385/night avg.</p>
							</div>
						</div>

						{/* Card 2 */}
						<div className="absolute top-16 right-32 w-64 bg-white rounded-2xl shadow-xl overflow-hidden">
							<div className="h-32 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
								<Home className="w-8 h-8 text-emerald-400/30" />
							</div>
							<div className="p-4">
								<p className="text-sm font-semibold text-text">
									Mountain Cabin
								</p>
								<p className="text-xs text-muted mt-1">$275/night avg.</p>
							</div>
						</div>

						{/* Card 3 */}
						<div className="absolute top-32 right-12 w-64 bg-white rounded-2xl shadow-xl overflow-hidden">
							<div className="h-32 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
								<Home className="w-8 h-8 text-amber-400/30" />
							</div>
							<div className="p-4">
								<p className="text-sm font-semibold text-text">
									City Apartment
								</p>
								<p className="text-xs text-muted mt-1">$195/night avg.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
