"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface VerificationStatusBannerProps {
	status: "pending" | "failed" | "verified";
}

export function VerificationStatusBanner({
	status,
}: VerificationStatusBannerProps) {
	const router = useRouter();

	if (status === "verified") return null;

	return (
		<Alert
			className="mb-4"
			variant={status === "failed" ? "destructive" : "default"}
		>
			<AlertDescription className="flex flex-col gap-3 items-center justify-between">
				<span>
					{status === "pending"
						? "Domain verification in progress..."
						: "Domain verification failed. Please check your DNS settings."}
				</span>
				<Button variant="outline" size="sm" className="w-full" asChild>
					<Link href="/dashboard/settings/domain">Check Status</Link>
				</Button>
			</AlertDescription>
		</Alert>
	);
}
