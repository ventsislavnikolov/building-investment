export function EmailCta() {
	return (
		<section className="bg-primary py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
						Looking for investment opportunities?
					</h2>
					<p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
						Join 840+ investors already building wealth through Bulgarian real
						estate. Get early access to new projects.
					</p>
					<form
						className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
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
			</div>
		</section>
	);
}
