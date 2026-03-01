import { SectionHeading } from "./section-heading";

export function HowItWorksHeader() {
	return (
		<section className="py-16 sm:py-24 bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<SectionHeading
					preText="How Keyturn"
					highlightText="works"
					subtitle="We help you find, buy, set up, and operate short-term rental properties."
				/>
			</div>
		</section>
	);
}
