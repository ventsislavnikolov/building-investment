import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useId } from "react";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const getKycStatus = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("Unauthenticated");

	const { data: profile } = await supabase
		.from("profiles")
		.select("kyc_status, sumsub_applicant_id")
		.eq("id", user.id)
		.single();

	return {
		kycStatus: (profile?.kyc_status ?? "not_started") as
			| "not_started"
			| "pending"
			| "approved"
			| "rejected",
		hasSumsubApplicant: !!profile?.sumsub_applicant_id,
	};
});

export const Route = createFileRoute("/(locale)/dashboard/kyc" as never)({
	loader: () => getKycStatus(),
	component: KycPage,
});

const STATUS_CONFIG = {
	not_started: {
		icon: null,
		color: "text-[#ACB3BA]",
		bg: "bg-[#EEF2F6]",
		border: "border-[#ACB3BA]",
		label: "Not Started",
		description:
			"Complete identity verification to unlock investing. Takes about 5 minutes.",
		cta: "Start Verification",
	},
	pending: {
		icon: Clock,
		color: "text-yellow-600",
		bg: "bg-yellow-50",
		border: "border-yellow-200",
		label: "Under Review",
		description:
			"Your documents are being reviewed. This usually takes 1–2 business days.",
		cta: null,
	},
	approved: {
		icon: CheckCircle,
		color: "text-green-600",
		bg: "bg-green-50",
		border: "border-green-200",
		label: "Verified",
		description: "Your identity has been verified. You can invest in projects.",
		cta: null,
	},
	rejected: {
		icon: XCircle,
		color: "text-red-600",
		bg: "bg-red-50",
		border: "border-red-200",
		label: "Rejected",
		description:
			"Your verification was unsuccessful. Please try again with clearer documents.",
		cta: "Try Again",
	},
};

function KycPage() {
	const { kycStatus } = Route.useLoaderData();
	const config = STATUS_CONFIG[kycStatus];
	const Icon = config.icon;
	const sumsubContainerId = useId();

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-[#151515]">
					Identity Verification
				</h1>
				<p className="text-sm text-[#ACB3BA] mt-1">
					KYC verification is required to invest in projects
				</p>
			</div>

			{/* Status card */}
			<div
				className={`rounded-2xl border p-6 flex items-start gap-4 ${config.bg} ${config.border}`}
			>
				{Icon && <Icon className={`w-6 h-6 mt-0.5 ${config.color}`} />}
				{!Icon && (
					<div className="w-6 h-6 mt-0.5 rounded-full border-2 border-[#ACB3BA]" />
				)}
				<div className="flex-1">
					<p className={`font-semibold ${config.color}`}>{config.label}</p>
					<p className="text-sm text-[#ACB3BA] mt-1">{config.description}</p>
				</div>
			</div>

			{/* Steps */}
			<div className="bg-white rounded-2xl border border-[#EEF2F6] p-6 space-y-4">
				<h2 className="font-semibold text-[#151515]">Verification Steps</h2>
				<div className="space-y-3">
					{[
						{ step: 1, label: "Personal information" },
						{ step: 2, label: "Government ID (passport or national ID)" },
						{ step: 3, label: "Selfie / liveness check" },
					].map(({ step, label }) => (
						<div key={step} className="flex items-center gap-3">
							<div
								className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${kycStatus === "approved" ? "bg-green-100 text-green-700" : "bg-[#EEF2F6] text-[#ACB3BA]"}`}
							>
								{kycStatus === "approved" ? "✓" : step}
							</div>
							<span className="text-sm text-[#151515]">{label}</span>
						</div>
					))}
				</div>
			</div>

			{/* CTA */}
			{config.cta && (
				<div>
					{/* Sumsub WebSDK mounts here when user clicks start */}
					<div id={sumsubContainerId} />
					<button
						type="button"
						className="bg-[#1B59E8] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1B59E8]/90 transition-colors"
						onClick={() => {
							/* Sumsub WebSDK init happens client-side */
							const container = document.getElementById(sumsubContainerId);
							if (container) container.scrollIntoView({ behavior: "smooth" });
						}}
					>
						{config.cta}
					</button>
				</div>
			)}
		</div>
	);
}
