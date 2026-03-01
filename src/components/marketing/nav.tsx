import { Link } from "@tanstack/react-router";
import { KeyRound, Menu, X } from "lucide-react";
import { useState } from "react";
import type { Locale } from "~/lib/i18n";
import { localePath } from "~/lib/routing";
import { cn } from "~/lib/utils";

interface MarketingNavProps {
	locale: Locale;
}

const NAV_LINKS = [
	{ key: "investments", label: "Investments", href: "/projects" },
	{ key: "pricing", label: "Pricing", href: "#" },
	{ key: "how-it-works", label: "How it works", href: "/how-it-works" },
	{ key: "about", label: "About us", href: "/about" },
];

export function MarketingNav({ locale }: MarketingNavProps) {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 bg-white border-b border-transparent transition-[border-color] duration-200 [&.scrolled]:border-border">
			<nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link
						to={localePath(locale, "/")}
						aria-label="home"
						className="flex items-center gap-2 shrink-0"
					>
						<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
							<KeyRound className="w-4 h-4 text-white" />
						</div>
						<span className="font-semibold text-text hidden sm:block">
							keyturn
						</span>
					</Link>

					{/* Desktop center links */}
					<div className="hidden md:flex items-center gap-8">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.key}
								to={localePath(locale, link.href)}
								className="text-sm font-medium text-muted hover:text-text transition-colors"
							>
								{link.label}
							</Link>
						))}
					</div>

					{/* Desktop right actions */}
					<div className="hidden md:flex items-center gap-3">
						<Link
							to={localePath(locale, "/login")}
							className="text-sm font-medium text-muted hover:text-text transition-colors"
						>
							Login
						</Link>
						<Link
							to={localePath(locale, "/register")}
							className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
						>
							Register
						</Link>
					</div>

					{/* Mobile hamburger */}
					<button
						type="button"
						className="md:hidden p-2 rounded-md text-muted hover:text-text hover:bg-muted/10 transition-colors"
						aria-label="toggle menu"
						onClick={() => setMenuOpen((o) => !o)}
					>
						{menuOpen ? (
							<X className="w-5 h-5" />
						) : (
							<Menu className="w-5 h-5" />
						)}
					</button>
				</div>

				{/* Mobile menu */}
				<div
					className={cn(
						"md:hidden overflow-hidden transition-all duration-200",
						menuOpen ? "max-h-96 pb-4" : "max-h-0",
					)}
				>
					<div className="flex flex-col gap-1 pt-2">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.key}
								to={localePath(locale, link.href)}
								className="px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-muted/10 hover:text-text transition-colors"
								onClick={() => setMenuOpen(false)}
							>
								{link.label}
							</Link>
						))}
						<div className="border-t border-border mt-2 pt-2 flex flex-col gap-1">
							<Link
								to={localePath(locale, "/login")}
								className="px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-muted/10 hover:text-text transition-colors"
								onClick={() => setMenuOpen(false)}
							>
								Login
							</Link>
							<Link
								to={localePath(locale, "/register")}
								className="mx-3 mt-1 flex items-center justify-center py-2 rounded-full bg-primary text-white text-sm font-medium"
								onClick={() => setMenuOpen(false)}
							>
								Register
							</Link>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
}
