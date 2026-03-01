export function CtaBanner() {
	return (
		<section className="relative overflow-hidden bg-primary py-16 sm:py-24">
			{/* Diagonal stripe elements */}
			<div className="absolute inset-0 overflow-hidden" aria-hidden="true">
				<div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 skew-y-6 rounded-3xl" />
				<div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 -skew-y-6 rounded-3xl" />
				<div className="absolute top-1/3 left-1/4 w-40 h-40 bg-white/5 skew-y-12 rounded-2xl" />
			</div>

			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
				<h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
					Thinking through your options?
				</h2>
				<p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
					Book a call with our team to discuss your investment strategy and find
					the right Airbnb property for you.
				</p>
				<a
					href="mailto:hello@keyturn.com"
					className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-primary text-sm font-semibold hover:bg-white/90 transition-colors"
				>
					Book a call
				</a>
			</div>
		</section>
	);
}
