import { Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { useId, useState } from "react";
import { z } from "zod";

const schema = z.object({
	email: z.string().email("Please enter a valid email"),
});

interface ForgotPasswordFormProps {
	onSubmit: (email: string) => Promise<void> | void;
	isLoading?: boolean;
	error?: string;
}

export function ForgotPasswordForm({
	onSubmit,
	isLoading,
	error,
}: ForgotPasswordFormProps) {
	const uid = useId();
	const emailId = `${uid}-email`;

	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState<string | undefined>();
	const [submitted, setSubmitted] = useState(false);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const result = schema.safeParse({ email });
		if (!result.success) {
			setEmailError(result.error.issues[0].message);
			return;
		}
		setEmailError(undefined);
		setSubmitted(true);
		onSubmit(result.data.email);
	}

	if (submitted && !error) {
		return (
			<div className="text-center py-4">
				<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
					<CheckCircle className="w-6 h-6 text-green-600" />
				</div>
				<h2 className="text-lg font-semibold text-text mb-2">
					Check your email
				</h2>
				<p className="text-sm text-muted">
					We sent a password reset link to{" "}
					<span className="font-medium text-text">{email}</span>
				</p>
				<Link
					to="/login"
					className="mt-6 inline-block text-sm text-primary hover:underline"
				>
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4" noValidate>
			{error && (
				<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
					{error}
				</div>
			)}

			<div className="space-y-1.5">
				<label
					htmlFor={emailId}
					className="block text-sm font-medium text-text"
				>
					Email address
				</label>
				<input
					id={emailId}
					name="email"
					type="email"
					autoComplete="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@example.com"
					className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
				/>
				{emailError && (
					<p className="text-xs text-red-600" role="alert">
						{emailError}
					</p>
				)}
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
			>
				{isLoading ? "Sending…" : "Send reset link"}
			</button>

			<p className="text-center text-sm text-muted">
				Remember your password?{" "}
				<Link to="/login" className="text-primary font-medium hover:underline">
					Sign in
				</Link>
			</p>
		</form>
	);
}
