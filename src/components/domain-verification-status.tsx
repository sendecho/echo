import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import type { DomainStatus } from "@/types/domain";

interface DomainVerificationStatusProps {
	status: DomainStatus;
}

const statusMessages = {
	pending: {
		title: "Verification in Progress",
		description:
			"We're verifying your DNS records. This process can take up to 24 hours.",
		icon: Clock,
		color: "text-yellow-500",
	},
	verified: {
		title: "Domain Verified",
		description: "Your domain has been successfully verified.",
		icon: CheckCircle,
		color: "text-green-500",
	},
	failed: {
		title: "Verification Failed",
		description:
			"We couldn't verify your domain. Please check your DNS records and try again.",
		icon: AlertCircle,
		color: "text-red-500",
	},
} as const;

export function DomainVerificationStatus({
	status,
}: DomainVerificationStatusProps) {
	if (status === "unverified") return null;

	const statusInfo = statusMessages[status];
	if (!statusInfo) return null;

	return (
		<Alert variant={status === "failed" ? "destructive" : "default"}>
			<statusInfo.icon className={`h-4 w-4 ${statusInfo.color}`} />
			<AlertTitle>{statusInfo.title}</AlertTitle>
			<AlertDescription>{statusInfo.description}</AlertDescription>
		</Alert>
	);
}
