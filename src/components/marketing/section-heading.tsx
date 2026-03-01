interface SectionHeadingProps {
	preText: string;
	highlightText: string;
	postText?: string;
	subtitle?: string;
	align?: "center" | "left";
}

function WavyUnderline() {
	return (
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
	);
}

export function SectionHeading({
	preText,
	highlightText,
	postText,
	subtitle,
	align = "center",
}: SectionHeadingProps) {
	return (
		<div className={align === "center" ? "text-center" : "text-left"}>
			<h2 className="text-3xl sm:text-4xl font-bold text-text">
				{preText}{" "}
				<span className="relative inline-block text-primary">
					{highlightText}
					<WavyUnderline />
				</span>
				{postText && ` ${postText}`}
			</h2>
			{subtitle && (
				<p className="mt-4 text-muted text-lg max-w-2xl mx-auto">{subtitle}</p>
			)}
		</div>
	);
}
