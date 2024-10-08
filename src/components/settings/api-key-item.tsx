"use client";

import { deleteAPIKey } from "@/actions/api-keys";
import { useToast } from "@/components/ui/use-toast";
import { SubmitButton } from "../ui/submit-button";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface APIKeyItemProps {
	apiKey: APIKey;
}

export default function APIKeyItem({ apiKey }: APIKeyItemProps) {
	const { toast } = useToast();
	const router = useRouter();

	const { executeAsync, status } = useAction(deleteAPIKey, {
		onSuccess: () => {
			router.refresh();

			toast({
				title: "API Key deleted",
				description: "The API key has been successfully deleted.",
				variant: "destructive",
			});
		},
	});

	return (
		<div className="flex items-center justify-between">
			<div>
				<div>
					<p className="text-lg font-medium whitespace-nowrap">{apiKey.name}</p>
					<p className="text-muted-foreground whitespace-nowrap">
						Created at{" "}
						<time dateTime={apiKey.created_at}>{apiKey.created_at}</time>
					</p>
				</div>
			</div>
			<div>
				<Badge>{apiKey.first_chars}</Badge>
			</div>
			<SubmitButton
				onClick={() => executeAsync({ keyId: apiKey.id })}
				isSubmitting={status === "executing"}
				variant="destructive"
				className="flex items-center"
			>
				Delete
			</SubmitButton>
		</div>
	);
}
