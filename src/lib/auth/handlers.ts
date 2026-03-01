import { createSupabaseServerClient } from "~/lib/supabase/server";
import { sendWelcomeEmail } from "~/server/notifications";

export async function handleLogin(data: { email: string; password: string }) {
	const supabase = createSupabaseServerClient();
	const { error } = await supabase.auth.signInWithPassword(data);
	if (error) return { error: error.message };
	return { success: true as const };
}

export async function handleRegister(data: {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}) {
	const supabase = createSupabaseServerClient();
	const { error } = await supabase.auth.signUp({
		email: data.email,
		password: data.password,
		options: { data: { first_name: data.firstName, last_name: data.lastName } },
	});
	if (error) return { error: error.message };
	// Fire-and-forget welcome email (don't block registration on email)
	const name = `${data.firstName} ${data.lastName}`.trim();
	sendWelcomeEmail({ to: data.email, name }).catch(() => null);
	return { success: true as const };
}

export async function handleLogout() {
	const supabase = createSupabaseServerClient();
	await supabase.auth.signOut();
	return { success: true as const };
}

export async function handleGetSessionUser() {
	const supabase = createSupabaseServerClient();
	const { data } = await supabase.auth.getUser();
	return data.user ?? null;
}

export async function handleGetSessionProfile() {
	const supabase = createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;
	const { data } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.id)
		.maybeSingle();
	return data;
}
