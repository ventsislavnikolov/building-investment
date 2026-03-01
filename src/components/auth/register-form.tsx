import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { z } from "zod";

const registerSchema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.string().email("Please enter a valid email"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type RegisterData = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

interface RegisterFormProps {
	onSubmit: (data: RegisterData) => Promise<void> | void;
	isLoading?: boolean;
	error?: string;
}

interface FormErrors {
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
}

export function RegisterForm({
	onSubmit,
	isLoading,
	error,
}: RegisterFormProps) {
	const uid = useId();
	const firstNameId = `${uid}-firstName`;
	const lastNameId = `${uid}-lastName`;
	const emailId = `${uid}-email`;
	const passwordId = `${uid}-password`;
	const confirmPasswordId = `${uid}-confirmPassword`;

	const [showPassword, setShowPassword] = useState(false);
	const [values, setValues] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});

	function setValue(key: keyof typeof values, value: string) {
		setValues((v) => ({ ...v, [key]: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const result = registerSchema.safeParse(values);
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
		const { confirmPassword: _, ...data } = result.data;
		onSubmit(data);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4" noValidate>
			{error && (
				<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
					{error}
				</div>
			)}

			<div className="grid grid-cols-2 gap-3">
				<div className="space-y-1.5">
					<label
						htmlFor={firstNameId}
						className="block text-sm font-medium text-text"
					>
						First name
					</label>
					<input
						id={firstNameId}
						name="firstName"
						type="text"
						autoComplete="given-name"
						value={values.firstName}
						onChange={(e) => setValue("firstName", e.target.value)}
						placeholder="John"
						className="w-full px-3 py-3 rounded-xl border border-border bg-white text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
					/>
					{errors.firstName && (
						<p className="text-xs text-red-600" role="alert">
							{errors.firstName}
						</p>
					)}
				</div>
				<div className="space-y-1.5">
					<label
						htmlFor={lastNameId}
						className="block text-sm font-medium text-text"
					>
						Last name
					</label>
					<input
						id={lastNameId}
						name="lastName"
						type="text"
						autoComplete="family-name"
						value={values.lastName}
						onChange={(e) => setValue("lastName", e.target.value)}
						placeholder="Doe"
						className="w-full px-3 py-3 rounded-xl border border-border bg-white text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
					/>
					{errors.lastName && (
						<p className="text-xs text-red-600" role="alert">
							{errors.lastName}
						</p>
					)}
				</div>
			</div>

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
					value={values.email}
					onChange={(e) => setValue("email", e.target.value)}
					placeholder="you@example.com"
					className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
				/>
				{errors.email && (
					<p className="text-xs text-red-600" role="alert">
						{errors.email}
					</p>
				)}
			</div>

			<div className="space-y-1.5">
				<label
					htmlFor={passwordId}
					className="block text-sm font-medium text-text"
				>
					Password
				</label>
				<div className="relative">
					<input
						id={passwordId}
						name="password"
						type={showPassword ? "text" : "password"}
						autoComplete="new-password"
						value={values.password}
						onChange={(e) => setValue("password", e.target.value)}
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

			<div className="space-y-1.5">
				<label
					htmlFor={confirmPasswordId}
					className="block text-sm font-medium text-text"
				>
					Confirm password
				</label>
				<input
					id={confirmPasswordId}
					name="confirmPassword"
					type="password"
					autoComplete="new-password"
					value={values.confirmPassword}
					onChange={(e) => setValue("confirmPassword", e.target.value)}
					placeholder="••••••••"
					className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
				/>
				{errors.confirmPassword && (
					<p className="text-xs text-red-600" role="alert">
						{errors.confirmPassword}
					</p>
				)}
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
			>
				{isLoading ? "Creating account…" : "Create account"}
			</button>

			<p className="text-center text-sm text-muted">
				Already have an account?{" "}
				<Link to="/login" className="text-primary font-medium hover:underline">
					Sign in
				</Link>
			</p>
		</form>
	);
}
