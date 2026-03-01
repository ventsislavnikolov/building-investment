import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter } from "lucide-react";
import type { Locale } from "~/lib/i18n";
import { localePath } from "~/lib/routing";

interface MarketingFooterProps {
	locale: Locale;
}

const PRODUCT_LINKS = [
	{ label: "How it works", href: "/how-it-works" },
	{ label: "Projects", href: "/projects" },
	{ label: "Pricing", href: "/pricing" },
	{ label: "FAQ", href: "/faq" },
];

const COMPANY_LINKS = [
	{ label: "About", href: "/about" },
	{ label: "Blog", href: "/blog" },
	{ label: "Careers", href: "/careers" },
	{ label: "Contact", href: "/contact" },
];

export function MarketingFooter({ locale }: MarketingFooterProps) {
	return (
		<footer className="bg-[#f8f9fa] border-t border-border">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{/* Col 1: Logo + tagline + social */}
					<div className="space-y-4">
						<Link
							to={localePath(locale, "/")}
							className="flex items-center gap-2"
						>
							<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
								<span className="text-white font-bold text-sm">B</span>
							</div>
							<span className="font-semibold text-text">BuildInvest</span>
						</Link>
						<p className="text-sm text-muted leading-relaxed">
							Invest in Bulgarian real estate with confidence. Transparent,
							regulated, and accessible to everyone.
						</p>
						<div className="flex items-center gap-3">
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Twitter"
								className="text-muted hover:text-text transition-colors"
							>
								<Twitter className="w-4 h-4" />
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn"
								className="text-muted hover:text-text transition-colors"
							>
								<Linkedin className="w-4 h-4" />
							</a>
							<a
								href="https://github.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub"
								className="text-muted hover:text-text transition-colors"
							>
								<Github className="w-4 h-4" />
							</a>
						</div>
					</div>

					{/* Col 2: Product */}
					<div>
						<h3 className="text-sm font-semibold text-text mb-4">Product</h3>
						<ul className="space-y-3">
							{PRODUCT_LINKS.map((link) => (
								<li key={link.href}>
									<Link
										to={localePath(locale, link.href)}
										className="text-sm text-muted hover:text-text transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Col 3: Company */}
					<div>
						<h3 className="text-sm font-semibold text-text mb-4">Company</h3>
						<ul className="space-y-3">
							{COMPANY_LINKS.map((link) => (
								<li key={link.href}>
									<Link
										to={localePath(locale, link.href)}
										className="text-sm text-muted hover:text-text transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Col 4: Newsletter */}
					<div>
						<h3 className="text-sm font-semibold text-text mb-4">Newsletter</h3>
						<p className="text-sm text-muted mb-4">
							Get the latest investment opportunities and market insights.
						</p>
						<form
							className="flex gap-2"
							onSubmit={(e) => e.preventDefault()}
							aria-label="newsletter"
						>
							<input
								type="email"
								placeholder="your@email.com"
								className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
								aria-label="email address"
							/>
							<button
								type="submit"
								className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
							>
								Subscribe
							</button>
						</form>
					</div>
				</div>

				{/* Bottom row */}
				<div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-muted">
						© {new Date().getFullYear()} BuildInvest. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						<Link
							to={localePath(locale, "/privacy")}
							className="text-xs text-muted hover:text-text transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							to={localePath(locale, "/terms")}
							className="text-xs text-muted hover:text-text transition-colors"
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
