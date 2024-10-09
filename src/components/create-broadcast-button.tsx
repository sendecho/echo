"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createEmail } from "@/lib/supabase/mutations/broadcasts";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { createEmailAction } from "@/actions/create-update-broadcast-action";

export default function CreateBroadcastButton() {
	const router = useRouter();

	const { execute, status } = useAction(createEmailAction, {
		onSuccess: ({ data: id }) => {
			router.push(`/dashboard/broadcasts/${id}`);
		},
	});

	return (
		<Button onClick={() => execute({})} disabled={status === "executing"}>
			{status === "executing" ? "Creating..." : "Create New Broadcast"}
		</Button>
	);
}
