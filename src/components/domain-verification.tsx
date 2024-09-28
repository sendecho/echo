"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ClipboardCopyIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { verifyDomain } from "@/actions/onboarding-actions";

interface DomainVerificationProps {
	domainData: any | null;
}

export default function DomainVerification({
	domainData,
}: DomainVerificationProps) {
	const { toast } = useToast();
	const router = useRouter();
	const [isVerifying, setIsVerifying] = useState(false);

	const handleVerify = async () => {
		setIsVerifying(true);
		try {
			const result = await verifyDomain();
			if (result?.data?.success) {
				toast({ title: "Domain verified successfully" });
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

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast({ title: "Copied to clipboard", duration: 2000 });
	};

	return (
		<div className="space-y-4 max-w-4xl mx-auto">
			<Alert>
				<AlertTitle>Domain Verification</AlertTitle>
				<AlertDescription>
					Add the following DNS records to verify your domain:
				</AlertDescription>
			</Alert>
			{domainData && domainData.records && (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Type</TableHead>
							<TableHead>Host/Name</TableHead>
							<TableHead>Value</TableHead>
							<TableHead>Priority</TableHead>
							<TableHead>TTL</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{domainData.records.map((record, index) => (
							<TableRow key={index}>
								<TableCell>{record.type}</TableCell>
								<TableCell>{record.name}</TableCell>
								<TableCell className="max-w-xs truncate">
									{record.value}
								</TableCell>
								<TableCell>{record?.priority}</TableCell>
								<TableCell>{record?.ttl}</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => copyToClipboard(record.value)}
									>
										<ClipboardCopyIcon className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
			<div className="flex justify-between">
				<Button
					variant="outline"
					onClick={() => router.push("/onboarding/email-setup")}
				>
					Back
				</Button>
				<div className="flex gap-2">
					<Button
						onClick={() => router.push("/onboarding/mailing-address")}
						variant="outline"
					>
						Skip
					</Button>
					<Button onClick={handleVerify} disabled={isVerifying}>
						{isVerifying ? "Verifying..." : "Verify Domain"}
					</Button>
				</div>
			</div>
		</div>
	);
}
