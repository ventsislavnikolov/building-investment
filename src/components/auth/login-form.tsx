import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

interface LoginFormProps {
	onSubmit: (data: LoginData) => Promise<void> | void;
	isLoading?: boolean;
	error?: string;
}

interface FormErrors {
	email?: string;
	password?: string;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
	const uid = useId();
	const emailId = `${uid}-email`;
	const passwordId = `${uid}-password`;

	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<FormErrors>({});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const result = loginSchema.safeParse({ email, password });
		if (!result.success) {
			const fieldErrors: FormErrors = {};
			for (const issue of result.error.issues) {
				const field = issue.path[0] as keyof FormErrors;
				if (!fieldErrors[field]) fieldErrors[field] = issue.message;
			}
			setErrors(fieldErrors);
			return;
		}
		setErrors({});
		onSubmit(result.data);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4" noValidate>
			{error && (
				<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
					{error}
				</div>
			)}

			{/* Email */}
			<div className="space-y-1.5">
				<label
					htmlFor={emailId}
					className="block text-sm font-medium text-text"
				>
					Email
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
				{errors.email && (
					<p className="text-xs text-red-600" role="alert">
						{errors.email}
					</p>
				)}
			</div>

			{/* Password */}
			<div className="space-y-1.5">
				<div className="flex items-center justify-between">
					<label
						htmlFor={passwordId}
						className="block text-sm font-medium text-text"
					>
						Password
					</label>
					<Link
						to="/forgot-password"
						className="text-xs text-primary hover:underline"
					>
						Forgot password?
					</Link>
				</div>
				<div className="relative">
					<input
						id={passwordId}
						name="password"
						type={showPassword ? "text" : "password"}
						autoComplete="current-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••"
						className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm pr-11"
					/>
					<button
						type="button"
						onClick={() => setShowPassword((s) => !s)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
						aria-label="toggle password visibility"
					>
						{showPassword ? (
							<EyeOff className="w-4 h-4" />
						) : (
							<Eye className="w-4 h-4" />
						)}
					</button>
				</div>
				{errors.password && (
					<p className="text-xs text-red-600" role="alert">
						{errors.password}
					</p>
				)}
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
			>
				{isLoading ? "Signing in…" : "Sign in"}
			</button>

			<div className="relative my-2">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-border" />
				</div>
				<div className="relative flex justify-center">
					<span className="bg-white px-3 text-xs text-muted">or</span>
				</div>
			</div>

			<p className="text-center text-sm text-muted">
				Don't have an account?{" "}
				<Link
					to="/register"
					className="text-primary font-medium hover:underline"
				>
					Register
				</Link>
			</p>
		</form>
	);
}
