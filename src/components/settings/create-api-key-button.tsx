"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction } from "next-safe-action/hooks";
import { toast } from "@/components/ui/use-toast";
import { createAPIKey } from "@/actions/api-keys";
import { useRouter } from "next/navigation";
import { getURL } from "@/lib/utils";

type CreateAPIKeyButtonProps = {
	variant?: "outline" | "default";
	size?: "default" | "sm" | "lg";
};

export default function CreateAPIKeyButton({
	variant = "default",
	size = "default",
}: CreateAPIKeyButtonProps) {
	const [open, setOpen] = useState(false);
	const [newApiKey, setNewApiKey] = useState<string | null>(null);
	const router = useRouter();

	const { executeAsync, status } = useAction(createAPIKey, {
		onSuccess: (result) => {
			if (result.data) {
				setNewApiKey(result.data.key); // This is the unhashed key
				toast({
					title: "Success",
					description: "API key created successfully",
				});
			} else {
				console.error("Unexpected result structure:", result);
				toast({
					title: "Error",
					description: "Failed to create API key: Unexpected result structure",
					variant: "destructive",
				});
			}
		},
		onError: (error) => {
			console.error("Error creating API key:", error);
			toast({
				title: "Error",
				description: error?.error?.serverError || "Failed to create API key",
				variant: "destructive",
			});
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		await executeAsync({
			name: formData.get("name") as string,
		});
	};

	const handleClose = () => {
		setOpen(false);
		setNewApiKey(null);
		router.refresh();
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (newOpen) {
			setOpen(true);
		} else {
			handleClose();
		}
	};

	const snippet = `curl -X POST '${getURL()}/api/v1/contacts' \\
  -H 'Content-Type: application/json' \\
  -H 'x-api-key: ${newApiKey}' \\
  -d '{
    "email": "test@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }'`;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant={variant} size={size}>
					Create API Key
				</Button>
			</DialogTrigger>

			{!newApiKey ? (
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create API Key</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									Name
								</Label>
								<Input id="name" name="name" className="col-span-3" />
							</div>
						</div>
						<div className="flex justify-end">
							<Button type="submit" disabled={status === "executing"}>
								{status === "executing" ? "Creating..." : "Create API Key"}
							</Button>
						</div>
					</form>
				</DialogContent>
			) : (
				<DialogContent className="max-w-[70%]">
					<DialogHeader>
						<DialogTitle>New API Key Created</DialogTitle>
						<DialogDescription>
							Make sure to copy your API key now. You won&apos;t be able to see
							it again!
						</DialogDescription>

						<div className="">
							<pre className="font-mono text-sm bg-muted p-4 rounded-md">
								{newApiKey}
							</pre>
						</div>
					</DialogHeader>

					<div className="space-y-3">
						<p>To use your API key try it in curl:</p>
						<pre className="font-mono bg-muted p-4 rounded-md text-sm">
							{snippet}
						</pre>
					</div>

					<DialogFooter>
						<Button onClick={handleClose}>Close</Button>
					</DialogFooter>
				</DialogContent>
			)}
		</Dialog>
	);
}
