import { Link } from "@tanstack/react-router";
import { Instagram, KeyRound, Linkedin, Twitter } from "lucide-react";
import type { Locale } from "~/lib/i18n";
import { localePath } from "~/lib/routing";

interface MarketingFooterProps {
	locale: Locale;
}

const COMPANY_LINKS = [
	{ label: "About", href: "/about" },
	{ label: "How it works", href: "/how-it-works" },
	{ label: "Pricing", href: "#" },
	{ label: "Careers", href: "/careers" },
];

const RESOURCE_LINKS = [
	{ label: "Blog", href: "/blog" },
	{ label: "Help center", href: "/help" },
	{ label: "FAQ", href: "/faq" },
	{ label: "Support", href: "/contact" },
];

const LEGAL_LINKS = [
	{ label: "Privacy", href: "/privacy" },
	{ label: "Terms", href: "/terms" },
	{ label: "Contact", href: "/contact" },
];

export function MarketingFooter({ locale }: MarketingFooterProps) {
	return (
		<footer className="bg-[#f8f9fa] border-t border-border">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{/* Col 1: Logo + tagline */}
					<div className="space-y-4">
						<Link
							to={localePath(locale, "/")}
							className="flex items-center gap-2"
						>
							<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
								<KeyRound className="w-4 h-4 text-white" />
							</div>
							<span className="font-semibold text-text">keyturn</span>
						</Link>
						<p className="text-sm text-muted leading-relaxed">
							Invest in short-term rental properties with confidence.
							Data-driven, professionally managed, and accessible to everyone.
						</p>
					</div>

					{/* Col 2: Company */}
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

					{/* Col 3: Resources */}
					<div>
						<h3 className="text-sm font-semibold text-text mb-4">Resources</h3>
						<ul className="space-y-3">
							{RESOURCE_LINKS.map((link) => (
								<li key={link.href + link.label}>
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

					{/* Col 4: Legal */}
					<div>
						<h3 className="text-sm font-semibold text-text mb-4">Legal</h3>
						<ul className="space-y-3">
							{LEGAL_LINKS.map((link) => (
								<li key={link.href + link.label}>
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
				</div>

				{/* Bottom row */}
				<div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-muted">
						&copy; {new Date().getFullYear()} keyturn. All rights reserved.
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
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Instagram"
							className="text-muted hover:text-text transition-colors"
						>
							<Instagram className="w-4 h-4" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
