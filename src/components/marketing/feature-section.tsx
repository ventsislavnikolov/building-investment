import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface FeatureSectionProps {
	eyebrow: string;
	heading: string;
	description: string;
	icon: LucideIcon;
	reverse?: boolean;
}

export function FeatureSection({
	eyebrow,
	heading,
	description,
	icon: Icon,
	reverse = false,
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
						<p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
							{eyebrow}
						</p>
						<h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
							{heading}
						</h2>
						<p className="text-muted text-lg leading-relaxed">{description}</p>
					</div>

					{/* Visual side */}
					<div className={cn(reverse && "lg:order-first")}>
						<div className="rounded-2xl bg-[#f8f9fa] border border-border p-10 flex items-center justify-center min-h-[280px]">
							<div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
								<Icon className="w-10 h-10 text-primary" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
