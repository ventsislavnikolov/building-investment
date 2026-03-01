import { Resend } from "resend";
import { getRuntimeEnv } from "~/env";
import {
	renderDistributionPaidEmail,
	renderInvestmentConfirmedEmail,
	renderKycApprovedEmail,
	renderWelcomeEmail,
} from "~/lib/email/templates";

function getResend() {
	const env = getRuntimeEnv();
	return new Resend(env.RESEND_API_KEY ?? "");
}

const FROM = "Building Investment <noreply@buildinginvestment.bg>";

export async function sendWelcomeEmail({
	to,
	name,
}: {
	to: string;
	name: string;
}) {
	const resend = getResend();
	await resend.emails.send({
		from: FROM,
		to,
		subject: "Welcome to Building Investment",
		html: renderWelcomeEmail({ name }),
	});
	return { sent: true };
}

export async function sendInvestmentConfirmedEmail({
	to,
	investorName,
	projectTitle,
	amount,
	currency,
}: {
	to: string;
	investorName: string;
	projectTitle: string;
	amount: number;
	currency: string;
}) {
	const resend = getResend();
	await resend.emails.send({
		from: FROM,
		to,
		subject: `Investment confirmed — ${projectTitle}`,
		html: renderInvestmentConfirmedEmail({
			amount,
			currency,
			projectTitle,
			investorName,
		}),
	});
	return { sent: true };
}

export async function sendDistributionPaidEmail({
	to,
	investorName,
	projectTitle,
	amount,
	currency,
}: {
	to: string;
	investorName: string;
	projectTitle: string;
	amount: number;
	currency: string;
}) {
	const resend = getResend();
	await resend.emails.send({
		from: FROM,
		to,
		subject: `Distribution received — ${projectTitle}`,
		html: renderDistributionPaidEmail({
			amount,
			currency,
			projectTitle,
			investorName,
		}),
	});
	return { sent: true };
}

export async function sendKycApprovedEmail({
	to,
	name,
}: {
	to: string;
	name: string;
}) {
	const resend = getResend();
	await resend.emails.send({
		from: FROM,
		to,
		subject: "Your identity has been verified",
		html: renderKycApprovedEmail({ name }),
	});
	return { sent: true };
}
