import { Home, MapPin, Star } from "lucide-react";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-white pt-16 pb-24 sm:pt-24 sm:pb-32">
			{/* Background gradient blobs */}
			<div className="absolute inset-0 -z-10" aria-hidden="true">
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
				<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full translate-y-1/2 -translate-x-1/2" />
			</div>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
					{/* Left: Text + CTA */}
					<div className="max-w-xl">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight tracking-tight">
							Investing in Airbnbs has never been{" "}
							<span className="relative inline-block text-primary">
								easier.
								<svg
									className="absolute -bottom-2 left-0 w-full text-primary"
									viewBox="0 0 100 8"
									preserveAspectRatio="none"
									fill="none"
									aria-hidden="true"
								>
									<path
										d="M0 5 Q 25 0, 50 5 Q 75 10, 100 5"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
									/>
								</svg>
							</span>
						</h1>

						<p className="mt-6 text-lg text-muted leading-relaxed">
							Keyturn helps you find, buy, set up, and manage short-term rental
							properties — so you can earn passive income from Airbnb without
							the hassle.
						</p>

						<div className="mt-8">
							<form
								className="flex gap-2 max-w-md"
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
									Get Started
								</button>
							</form>
							<p className="mt-3 text-xs text-muted">No credit card required</p>
						</div>
					</div>

					{/* Right: Property listing card */}
					<div className="relative lg:ml-auto w-full max-w-md">
						<div className="rounded-2xl bg-white border border-border shadow-xl overflow-hidden">
							{/* Image area */}
							<div className="relative h-56 bg-gradient-to-br from-blue-100 via-blue-50 to-slate-100">
								<Home className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-primary/20" />
								{/* Image overlay dots (like a photo grid) */}
								<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
									<div className="w-2 h-2 rounded-full bg-white" />
									<div className="w-2 h-2 rounded-full bg-white/50" />
									<div className="w-2 h-2 rounded-full bg-white/50" />
								</div>
							</div>
							{/* Card details */}
							<div className="p-5">
								<div className="flex items-start justify-between mb-2">
									<div>
										<h3 className="font-semibold text-text">
											Modern Beach House
										</h3>
										<div className="flex items-center gap-1 mt-1 text-muted">
											<MapPin className="w-3.5 h-3.5" />
											<span className="text-xs">Malibu, California</span>
										</div>
									</div>
									<div className="flex items-center gap-1">
										<Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
										<span className="text-sm font-semibold text-text">4.9</span>
									</div>
								</div>
								<div className="flex items-center justify-between pt-3 border-t border-border mt-3">
									<div>
										<p className="text-xs text-muted">Nightly rate</p>
										<p className="text-lg font-bold text-text">$425</p>
									</div>
									<div>
										<p className="text-xs text-muted">Occupancy</p>
										<p className="text-lg font-bold text-primary">87%</p>
									</div>
									<div>
										<p className="text-xs text-muted">Annual ROI</p>
										<p className="text-lg font-bold text-green-600">18.2%</p>
									</div>
								</div>
							</div>
						</div>

						{/* Floating badge: rating */}
						<div className="absolute -top-3 -right-3 bg-white rounded-xl shadow-lg border border-border px-3 py-2 z-10">
							<div className="flex items-center gap-1.5">
								<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
								<span className="text-sm font-bold text-text">4.9</span>
							</div>
						</div>

						{/* Floating badge: price */}
						<div className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-lg border border-border px-3 py-2 z-10">
							<p className="text-sm font-bold text-text">$425/night</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
