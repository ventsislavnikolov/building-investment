import { useEffect, useId, useRef, useState } from "react";
import { createSumsubToken } from "~/server/kyc";

declare global {
	interface Window {
		// biome-ignore lint/suspicious/noExplicitAny: Sumsub SDK uses any
		SumsubWebSdk?: { init: (config: any) => { launch: () => void } };
	}
}

const SUMSUB_SDK_URL =
	"https://static.sumsub.com/idensic/static/sns-websdk-builder.js";

function loadSumsubSdk(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (window.SumsubWebSdk) {
			resolve();
			return;
		}
		const script = document.createElement("script");
		script.src = SUMSUB_SDK_URL;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error("Failed to load Sumsub SDK"));
		document.head.appendChild(script);
	});
}

interface SumsubWidgetProps {
	onApproved?: () => void;
	onRejected?: () => void;
}

export function SumsubWidget({ onApproved }: SumsubWidgetProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const containerId = useId();
	const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
		"loading",
	);

	useEffect(() => {
		let cancelled = false;

		async function init() {
			try {
				const { token } = await createSumsubToken();
				if (cancelled) return;

				await loadSumsubSdk();
				if (cancelled || !containerRef.current || !window.SumsubWebSdk) return;

				const sdk = window.SumsubWebSdk.init({
					accessToken: token,
					containerId,
					onMessage: (type: string) => {
						if (type === "idCheck.applicantReviewComplete") {
							onApproved?.();
						}
					},
					onError: (err: unknown) => {
						console.error("Sumsub error:", err);
						if (!cancelled) setStatus("error");
					},
				});
				sdk.launch();
				if (!cancelled) setStatus("ready");
			} catch {
				if (!cancelled) setStatus("error");
			}
		}

		init();
		return () => {
			cancelled = true;
		};
	}, [onApproved, containerId]);

	return (
		<div className="space-y-4">
			{status === "loading" && (
				<div className="flex items-center justify-center h-32 rounded-xl border border-border bg-[#f8f9fa]">
					<div className="flex items-center gap-2 text-muted text-sm">
						<div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
						Loading verification...
					</div>
				</div>
			)}
			{status === "error" && (
				<div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
					Failed to load verification. Please refresh and try again.
				</div>
			)}
			<div
				id={containerId}
				ref={containerRef}
				data-testid="sumsub-container"
				className={status === "ready" ? "block" : "hidden"}
			/>
		</div>
	);
}
