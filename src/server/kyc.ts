import crypto from "node:crypto";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getRuntimeEnv } from "~/env";
import { createSupabaseAdminClient } from "~/lib/supabase/admin";
import { createSupabaseServerClient } from "~/lib/supabase/server";
import { sendKycApprovedEmail } from "~/server/notifications";

export function verifySumsubSignature(
	payload: string,
	signature: string,
	secret: string,
): boolean {
	const expected = crypto
		.createHmac("sha256", secret)
		.update(payload)
		.digest("hex");
	return expected === signature;
}

export const createSumsubToken = createServerFn({ method: "POST" }).handler(
	async () => {
		const supabase = createSupabaseServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw redirect({ to: "/login" });

		const env = getRuntimeEnv();
		const ts = Math.floor(Date.now() / 1000);
		const method = "POST";
		const url = `/resources/accessTokens?userId=${user.id}&levelName=basic-kyc-level`;

		const signature = crypto
			.createHmac("sha256", env.SUMSUB_SECRET_KEY ?? "")
			.update(`${ts}${method}${url}`)
			.digest("hex");

		const res = await fetch(`https://api.sumsub.com${url}`, {
			method,
			headers: {
				"X-App-Token": env.SUMSUB_APP_TOKEN ?? "",
				"X-App-Access-Sig": signature,
				"X-App-Access-Ts": String(ts),
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) throw new Error("Failed to create Sumsub token");
		const data = (await res.json()) as { token: string };
		return { token: data.token };
	},
);

const sumsubWebhookSchema = z.object({
	type: z.string(),
	applicantId: z.string(),
	reviewStatus: z.string().optional(),
	reviewResult: z.object({ reviewAnswer: z.string().optional() }).optional(),
});

export async function handleSumsubWebhook(
	body: string,
	signature: string,
): Promise<Response> {
	const env = getRuntimeEnv();
	if (!verifySumsubSignature(body, signature, env.SUMSUB_SECRET_KEY ?? "")) {
		return new Response("Invalid signature", { status: 400 });
	}

	const event = sumsubWebhookSchema.safeParse(JSON.parse(body));
	if (!event.success) return new Response("ok", { status: 200 });

	if (
		event.data.type === "applicantReviewed" &&
		event.data.reviewResult?.reviewAnswer === "GREEN"
	) {
		const supabase = createSupabaseAdminClient();
		await supabase
			.from("profiles")
			.update({ kyc_status: "approved" })
			.eq("sumsub_applicant_id", event.data.applicantId);

		// Send KYC approved email
		const { data: profile } = await supabase
			.from("profiles")
			.select("first_name, last_name, email")
			.eq("sumsub_applicant_id", event.data.applicantId)
			.maybeSingle();
		if (profile?.email) {
			sendKycApprovedEmail({
				to: profile.email,
				name:
					`${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
					"Investor",
			}).catch(() => null);
		}
	}

	if (event.data.type === "applicantPending") {
		const supabase = createSupabaseAdminClient();
		await supabase
			.from("profiles")
			.update({ kyc_status: "pending" })
			.eq("sumsub_applicant_id", event.data.applicantId);
	}

	return new Response("ok", { status: 200 });
}
