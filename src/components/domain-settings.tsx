"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import DomainRecords from "@/components/domain-records";
import { DomainVerificationStatus } from "./domain-verification-status";
import type { DomainStatus } from "@/types/domain";
import { checkVerificationStatus } from "@/actions/onboarding-actions";

interface DomainSettingsProps {
	account: {
		id: string;
		domain?: string;
		domain_verification_status: string;
		resend_domain_id?: string;
	};
	domainData: {
		records: Array<{
			type: string;
			host: string;
			value: string;
			priority?: number;
		}>;
		status: DomainStatus;
	} | null;
}

export function DomainSettings({ account, domainData }: DomainSettingsProps) {
	const [domain, setDomain] = useState(account.domain || "");
	const [isVerifying, setIsVerifying] = useState(false);
	const { toast } = useToast();

	const handleVerify = async () => {
		setIsVerifying(true);
		try {
			const result = await checkVerificationStatus();

			if (result?.data?.success) {
				toast({
					title: "Verification Started",
					description:
						"Please check the DNS records and wait for verification to complete.",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to start domain verification",
				variant: "destructive",
			});
		}
		setIsVerifying(false);
	};

	return (
		<Card>
			<CardHeader>
				<h2 className="text-xl font-semibold">Domain Settings</h2>
				<p className="text-muted-foreground">
					Configure your custom domain for sending emails
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<label htmlFor="domain">Domain Name</label>
					<Input
						id="domain"
						value={domain}
						onChange={(e) => setDomain(e.target.value)}
						placeholder="yourdomain.com"
						readOnly
						disabled
					/>
				</div>

				<div>
					<DomainVerificationStatus
						status={domainData?.status || "unverified"}
					/>
					{account.domain_verification_status === "pending" && (
						<Button
							variant="outline"
							onClick={() => window.location.reload()}
							className="mt-4"
						>
							Check Status
						</Button>
					)}
				</div>

				<DomainRecords records={domainData?.records || []} />
			</CardContent>
			<CardFooter>
				<Button
					onClick={handleVerify}
					disabled={
						isVerifying ||
						!domain ||
						["pending", "verified"].includes(account.domain_verification_status)
					}
				>
					{isVerifying ||
					["pending"].includes(account.domain_verification_status)
						? "Verifying..."
						: "Verify Domain"}
				</Button>
			</CardFooter>
		</Card>
	);
}
