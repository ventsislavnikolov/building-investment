import { SectionHeading } from "./section-heading";

const COMPANIES = ["Indeed", "Google", "Airbnb", "Microsoft", "Amazon", "Meta"];

export function CompanyLogos() {
	return (
		<section className="py-16 sm:py-24 bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-12">
					<SectionHeading preText="Keyturners" highlightText="work at" />
				</div>

				<div className="flex flex-wrap justify-center gap-6 sm:gap-8">
					{COMPANIES.map((name) => (
						<div
							key={name}
							className="bg-white border border-border rounded-lg px-6 py-3 text-sm font-medium text-muted"
						>
							{name}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
