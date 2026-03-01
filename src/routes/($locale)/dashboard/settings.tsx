import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useId, useState } from "react";
import { createSupabaseServerClient } from "~/lib/supabase/server";

const getProfileData = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("Unauthenticated");

	const { data: profile } = await supabase
		.from("profiles")
		.select("full_name, phone, avatar_url")
		.eq("id", user.id)
		.maybeSingle();

	return { user: { email: user.email ?? "" }, profile };
});

type Tab = "profile" | "password" | "notifications";

export const Route = createFileRoute("/($locale)/dashboard/settings")({
	loader: async () => {
		const data = await getProfileData();
		return data;
	},
	component: function SettingsPage() {
		const { user, profile } = Route.useLoaderData();
		const [tab, setTab] = useState<Tab>("profile");
		const uid = useId();

		const tabs: { id: Tab; label: string }[] = [
			{ id: "profile", label: "Profile" },
			{ id: "password", label: "Password" },
			{ id: "notifications", label: "Notifications" },
		];

		return (
			<div className="space-y-6 max-w-2xl">
				<div>
					<h1 className="text-2xl font-bold text-text">Settings</h1>
					<p className="text-muted mt-1">Manage your account preferences</p>
				</div>

				{/* Tabs */}
				<div className="flex gap-1 p-1 rounded-xl bg-[#f0f2f5] w-fit">
					{tabs.map((t) => (
						<button
							key={t.id}
							type="button"
							onClick={() => setTab(t.id)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								tab === t.id
									? "bg-white text-text shadow-sm"
									: "text-muted hover:text-text"
							}`}
						>
							{t.label}
						</button>
					))}
				</div>

				{tab === "profile" && (
					<div className="rounded-2xl border border-border bg-white p-6 space-y-4">
						<h2 className="text-base font-semibold text-text">
							Profile Information
						</h2>
						<div>
							<label
								htmlFor={`${uid}-name`}
								className="block text-sm font-medium text-text mb-1.5"
							>
								Full name
							</label>
							<input
								id={`${uid}-name`}
								type="text"
								defaultValue={profile?.full_name ?? ""}
								className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
							/>
						</div>
						<div>
							<label
								htmlFor={`${uid}-email`}
								className="block text-sm font-medium text-text mb-1.5"
							>
								Email
							</label>
							<input
								id={`${uid}-email`}
								type="email"
								defaultValue={user.email}
								disabled
								className="w-full px-4 py-3 rounded-xl border border-border bg-[#f8f9fa] text-muted text-sm cursor-not-allowed"
							/>
						</div>
						<div>
							<label
								htmlFor={`${uid}-phone`}
								className="block text-sm font-medium text-text mb-1.5"
							>
								Phone
							</label>
							<input
								id={`${uid}-phone`}
								type="tel"
								defaultValue={profile?.phone ?? ""}
								className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
							/>
						</div>
						<button
							type="button"
							className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
						>
							Save changes
						</button>
					</div>
				)}

				{tab === "password" && (
					<div className="rounded-2xl border border-border bg-white p-6 space-y-4">
						<h2 className="text-base font-semibold text-text">
							Change Password
						</h2>
						<div>
							<label
								htmlFor={`${uid}-current`}
								className="block text-sm font-medium text-text mb-1.5"
							>
								Current password
							</label>
							<input
								id={`${uid}-current`}
								type="password"
								className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
							/>
						</div>
						<div>
							<label
								htmlFor={`${uid}-new`}
								className="block text-sm font-medium text-text mb-1.5"
							>
								New password
							</label>
							<input
								id={`${uid}-new`}
								type="password"
								className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
							/>
						</div>
						<div>
							<label
								htmlFor={`${uid}-confirm`}
								className="block text-sm font-medium text-text mb-1.5"
							>
								Confirm new password
							</label>
							<input
								id={`${uid}-confirm`}
								type="password"
								className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
							/>
						</div>
						<button
							type="button"
							className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
						>
							Update password
						</button>
					</div>
				)}

				{tab === "notifications" && (
					<div className="rounded-2xl border border-border bg-white p-6 space-y-4">
						<h2 className="text-base font-semibold text-text">
							Notification Preferences
						</h2>
						{[
							{
								id: "invest",
								label: "Investment updates",
								desc: "Status changes for your investments",
							},
							{
								id: "distrib",
								label: "Distribution payments",
								desc: "When distributions are paid to your account",
							},
							{
								id: "progress",
								label: "Project progress",
								desc: "Construction and project updates",
							},
							{
								id: "promo",
								label: "New projects",
								desc: "When new investment opportunities are available",
							},
						].map((pref) => (
							<label
								key={pref.id}
								className="flex items-start gap-3 cursor-pointer"
							>
								<input
									type="checkbox"
									defaultChecked
									className="mt-0.5 accent-primary"
									aria-label={pref.label}
								/>
								<div>
									<p className="text-sm font-medium text-text">{pref.label}</p>
									<p className="text-xs text-muted">{pref.desc}</p>
								</div>
							</label>
						))}
						<button
							type="button"
							className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
						>
							Save preferences
						</button>
					</div>
				)}
			</div>
		);
	},
});
