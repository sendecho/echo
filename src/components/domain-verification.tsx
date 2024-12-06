"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { checkVerificationStatus } from "@/actions/onboarding-actions";
import DomainRecords from "@/components/domain-records";
import { DomainVerificationStatus } from "./domain-verification-status";
import type { DomainStatus } from "@/types/domain";

interface DomainVerificationProps {
	domainData: {
		records: {
			type: string;
			host: string;
			value: string;
			priority?: number;
		}[];
		status: DomainStatus;
	} | null;
}

export default function DomainVerification({
	domainData,
}: DomainVerificationProps) {
	const { toast } = useToast();
	const router = useRouter();
	const [isVerifying, setIsVerifying] = useState(false);
	const [isCheckingStatus, setIsCheckingStatus] = useState(false);

	const status = domainData?.status || "unverified";

	const handleVerify = async () => {
		setIsVerifying(true);
		try {
			const result = await checkVerificationStatus();
			if (result?.data?.success) {
				toast({
					title: "Verification initiated",
					description:
						"This process may take up to 24 hours. You can continue with the setup and check the status later.",
					duration: 5000,
				});
				router.push("/onboarding/mailing-address");
			} else {
				toast({
					title: "Verification failed",
					description: result?.data?.error,
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		}
		setIsVerifying(false);
	};

	const triggerLocalVerificationCheck = async () => {
		setIsCheckingStatus(true);
		try {
			await router.refresh();
		} finally {
			setIsCheckingStatus(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<h1 className="text-2xl font-bold">Domain Verification</h1>
					<p className="text-sm text-muted-foreground">
						Add the following DNS records to verify your domain:
					</p>
				</div>

				<DomainVerificationStatus status={status} />
			</div>

			<DomainRecords records={domainData?.records || []} />

			<div className="flex justify-between">
				<Button
					variant="outline"
					onClick={() => router.push("/onboarding/email-setup")}
				>
					Back
				</Button>
				<div className="flex gap-2">
					{status === "pending" ? (
						<>
							<Button
								variant="outline"
								onClick={() => router.push("/onboarding/mailing-address")}
							>
								Continue Setup
							</Button>
							<Button
								variant="secondary"
								onClick={triggerLocalVerificationCheck}
								disabled={isCheckingStatus}
							>
								{isCheckingStatus ? "Checking..." : "Check Status"}
							</Button>
						</>
					) : status === "verified" ? (
						<Button onClick={() => router.push("/onboarding/mailing-address")}>
							Continue
						</Button>
					) : (
						<>
							<Button
								onClick={() => router.push("/onboarding/mailing-address")}
								variant="outline"
							>
								Skip
							</Button>
							<Button
								onClick={handleVerify}
								disabled={isVerifying || status === "pending"}
							>
								{isVerifying ? "Verifying..." : "Verify Domain"}
							</Button>
						</>
					)}
				</div>
			</div>

			{status === "pending" && (
				<p className="text-sm text-muted-foreground text-center mt-4">
					You can continue with the setup while we verify your domain.
					We&apos;ll notify you once verification is complete.
				</p>
			)}
		</div>
	);
}
