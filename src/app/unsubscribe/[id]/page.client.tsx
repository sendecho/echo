"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "@/components/ui/use-toast";
import { unsubscribeAction } from "@/actions/unsubscribe-action";
import {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";

interface UnsubscribePageProps {
	params: {
		id: string;
	};
}

export default function UnsubscribePageClient({
	params,
}: UnsubscribePageProps) {
	const { id } = params;
	const [isUnsubscribed, setIsUnsubscribed] = useState(false);
	const [hasError, setHasError] = useState(false);
	const router = useRouter();

	const { executeAsync, status } = useAction(unsubscribeAction, {
		onSuccess: () => {
			setIsUnsubscribed(true);
		},
		onError: () => {
			setHasError(true);
		},
	});

	if (hasError) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<Card className="border-border">
					<CardHeader>
						<CardTitle className="text-red-600">Error</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription>
							There was an error processing your request. Please try again
							later.
						</CardDescription>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isUnsubscribed) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<Card className="border-border">
					<CardHeader>
						<CardTitle className="text-green-600 text-center">
							Unsubscribed
						</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription className="text-center">
							You have successfully unsubscribed.
						</CardDescription>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<Card className="border-border">
				<CardHeader>
					<CardTitle>Confirm Unsubscription</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription>
						Are you sure you want to unsubscribe?
					</CardDescription>
				</CardContent>
				<CardFooter className="space-x-4">
					<SubmitButton
						onClick={() => executeAsync({ contactId: id })}
						variant="destructive"
						isSubmitting={status === "executing"}
					>
						Yes, Unsubscribe
					</SubmitButton>
					<Button variant="secondary" onClick={() => router.push("/")}>
						Cancel
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
