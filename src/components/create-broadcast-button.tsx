"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { createEmailAction } from "@/actions/create-update-broadcast-action";
import { SubmitButton } from "./ui/submit-button";

export default function CreateBroadcastButton() {
	const router = useRouter();

	const { execute, status } = useAction(createEmailAction, {
		onSuccess: ({ data: id }) => {
			router.push(`/dashboard/broadcasts/${id}`);
		},
	});

	return (
		<SubmitButton
			type="button"
			isSubmitting={status === "executing" || status === "hasSucceeded"}
			onClick={() => execute({})}
		>
			Create New Broadcast
		</SubmitButton>
	);
}
