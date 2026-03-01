import { cn } from "~/lib/utils";

interface FeatureSectionProps {
	heading: string;
	description: string;
	bulletPoints?: string[];
	reverse?: boolean;
	children?: React.ReactNode;
}

export function FeatureSection({
	heading,
	description,
	bulletPoints,
	reverse = false,
	children,
}: FeatureSectionProps) {
	return (
		<section className="py-16 sm:py-24 bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div
					className={cn(
						"grid grid-cols-1 gap-12 lg:grid-cols-2 items-center",
						reverse && "lg:[&>*:first-child]:order-2",
					)}
				>
					{/* Text side */}
					<div>
						<h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
							{heading}
						</h2>
						<p className="text-muted text-lg leading-relaxed">{description}</p>
						{bulletPoints && bulletPoints.length > 0 && (
							<ul className="mt-6 space-y-3">
								{bulletPoints.map((point) => (
									<li key={point} className="flex items-start gap-3">
										<svg
											className="w-5 h-5 text-primary shrink-0 mt-0.5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span className="text-sm text-muted">{point}</span>
									</li>
								))}
							</ul>
						)}
					</div>

					{/* Visual side */}
					<div className={cn(reverse && "lg:order-first")}>{children}</div>
				</div>
			</div>
		</section>
	);
}
