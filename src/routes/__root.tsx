import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { ErrorBoundary } from "~/components/error-boundary";
import { initSentry } from "~/lib/monitoring/sentry";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	component: function Root() {
		return (
			<ErrorBoundary>
				<Outlet />
			</ErrorBoundary>
		);
	},
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Building Investment — Real Estate in Bulgaria" },
			{
				name: "description",
				content:
					"Invest in curated Bulgarian real estate projects. Minimum €500. Target IRR 8–18%. Transparent, regulated, digital.",
			},
			{ name: "theme-color", content: "#1B59E8" },
			{ property: "og:site_name", content: "Building Investment" },
			{
				property: "og:title",
				content: "Building Investment — Real Estate in Bulgaria",
			},
			{
				property: "og:description",
				content:
					"Invest in curated Bulgarian real estate projects starting from €500.",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:locale", content: "en_US" },
			{ name: "twitter:card", content: "summary_large_image" },
		],
		links: [
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
			},
			{ rel: "stylesheet", href: appCss },
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		initSentry(import.meta.env.VITE_SENTRY_DSN as string | undefined);
	}, []);

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
