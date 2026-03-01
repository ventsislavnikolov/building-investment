export function CtaBanner() {
	return (
		<section className="relative overflow-hidden bg-primary py-16 sm:py-24">
			{/* Geometric shapes */}
			<div
				className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"
				aria-hidden="true"
			/>
			<div
				className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2"
				aria-hidden="true"
			/>
			<div
				className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2"
				aria-hidden="true"
			/>

			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
				<h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
					Thinking about investing?
				</h2>
				<p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
					Book a free 30-minute call with our investment advisors. We'll walk
					you through our projects and help you find the right fit.
				</p>
				<a
					href="mailto:invest@buildinvest.bg"
					className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-primary text-sm font-semibold hover:bg-white/90 transition-colors"
				>
					Book a call
				</a>
			</div>
		</section>
	);
}
