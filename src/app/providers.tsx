// app/providers.tsx
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { env } from "@/env";
import { PosthogPageview } from "@/components/posthog-pageview";
import { ThemeProvider } from "next-themes";

if (typeof window !== "undefined") {
	posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
		person_profiles: "identified_only",
		capture_pageview: false, // Disable automatic pageview capture, as we capture manually
		capture_pageleave: true,
	});
}

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<PostHogProvider client={posthog}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<PosthogPageview />
				{children}
			</ThemeProvider>
		</PostHogProvider>
	);
}
