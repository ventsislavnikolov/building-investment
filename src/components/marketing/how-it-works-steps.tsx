import { BarChart3, CheckCircle, Search, UserCheck } from "lucide-react";

const STEPS = [
	{
		number: 1,
		icon: UserCheck,
		title: "Register",
		description:
			"Create your account in minutes. Complete identity verification (KYC) to unlock investment access. Fully digital, no paperwork required.",
	},
	{
		number: 2,
		icon: Search,
		title: "Browse",
		description:
			"Explore curated real estate projects across Bulgaria. Filter by location, IRR, investment size, and strategy. Access full financial documentation.",
	},
	{
		number: 3,
		icon: BarChart3,
		title: "Invest",
		description:
			"Choose your investment amount (from €500) and complete your investment via secure bank transfer or card payment. Receive digital documentation instantly.",
	},
	{
		number: 4,
		icon: CheckCircle,
		title: "Earn",
		description:
			"Track your portfolio performance in real time. Receive quarterly distributions directly to your account. Access annual reports and tax documents.",
	},
];

export function HowItWorksSteps() {
	return (
		<div className="space-y-0">
			{STEPS.map((step, index) => {
				const Icon = step.icon;
				const isLast = index === STEPS.length - 1;
				return (
					<div
						key={step.number}
						data-testid="step"
						className="relative flex gap-6 sm:gap-8"
					>
						{/* Left: Number + connector line */}
						<div className="flex flex-col items-center shrink-0">
							<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-md">
								{step.number}
							</div>
							{!isLast && (
								<div className="w-0.5 flex-1 bg-border my-3 min-h-[40px]" />
							)}
						</div>

						{/* Right: Content */}
						<div className="pb-12">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
									<Icon className="w-5 h-5 text-primary" />
								</div>
								<h3 className="text-xl font-semibold text-text">
									{step.title}
								</h3>
							</div>
							<p className="text-muted leading-relaxed max-w-lg">
								{step.description}
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
}
