"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { updateEmailAction } from "@/actions/create-update-broadcast-action";
import { sendBroadcastAction } from "@/actions/send-broadcast-action";
import { toast } from "@/components/ui/use-toast";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";
import { ContactSelector } from "@/components/contacts-selector";
import Editor from "./editor/editor";
import { sendPreviewBroadcastMutation } from "@/lib/supabase/mutations/broadcasts";
import { SubmitButton } from "./ui/submit-button";
import { Database } from "@/types/supabase";
import { Label } from "./ui/label";
import { ListSelector } from "@/components/list-selector";

import type { UpdateBroadcastType } from "@/lib/schemas/broadcast-schema";

interface BroadcastEditorProps {
	initialBroadcast?: UpdateBroadcastType;
}

export function BroadcastEditor({ initialBroadcast }: BroadcastEditorProps) {
	const [broadcast, setBroadcast] = useState<UpdateBroadcastType>(
		initialBroadcast || {
			id: "",
			subject: "",
			content: "",
			preview: "",
			from_name: "",
			from_email: "",
		},
	);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [savingStatus, setSavingStatus] = useState<"idle" | "saving" | "saved">(
		initialBroadcast ? "saved" : "idle",
	);
	const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
	const [selectedLists, setSelectedLists] = useState<string[]>([]);
	const [testEmail, setTestEmail] = useState("");
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [isSendingEmail, setIsSendingEmail] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	const debouncedSave = useDebouncedCallback(
		async (updatedBroadcast: UpdateBroadcastType) => {
			try {
				setSavingStatus("saving");
				const result = await updateEmailAction(updatedBroadcast);

				console.log("result", result);
				const newId = result?.data.id ?? null;
				setBroadcast((prev) => ({ ...prev, id: newId }));

				// Update URL if it's a new broadcast and we got an ID
				if (newId && pathname === "/dashboard/broadcasts/new") {
					router.push(`/dashboard/broadcasts/${newId}`);
				}

				setTimeout(() => setSavingStatus("saved"), 1000);
			} catch (error) {
				console.error("Failed to save draft:", error);
				setSavingStatus("idle");
				toast({
					title: "Error",
					description: "Failed to save draft",
					variant: "destructive",
				});
			}
		},
		1000,
	);

	function handleChange<T extends keyof UpdateBroadcastType>(field: T) {
		return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			let value = e.target.value;
			const updatedBroadcast = { ...broadcast, [field]: value };
			setBroadcast(updatedBroadcast);
			debouncedSave(updatedBroadcast);
		};
	}

	async function handleSend(selectedContacts: string[]) {
		if (!broadcast.id) {
			toast({
				title: "Error",
				description: "Please wait for the email to be saved before sending.",
				variant: "destructive",
			});
			return;
		}

		try {
			setIsSendingEmail(true);
			const result = await sendBroadcastAction({
				emailId: broadcast.id,
				listIds: selectedLists,
				contactIds: selectedContacts, // Convert numbers to strings
			});

			if (result?.data?.event?.output?.success) {
				toast({
					title: "Broadcast sent",
					description: "Your broadcast has been sent successfully.",
				});
				router.push("/dashboard/broadcasts");
			}
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to send broadcast",
				variant: "destructive",
			});
		}
		setIsSendingEmail(false);
	}

	async function handleSendTestEmail(email: string) {
		if (!broadcast.id) {
			toast({
				title: "Error",
				description: "Please wait for the email to be saved before sending.",
				variant: "destructive",
			});
			return;
		}

		try {
			setIsSendingEmail(true);
			const result = await sendPreviewBroadcastMutation({
				emailId: broadcast.id,
				emailAddress: email,
			});
			if (result?.success) {
				toast({
					title: "Test email sent",
					description: "Your test email has been sent successfully.",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to send test email",
				variant: "destructive",
			});
		}
		setIsSendingEmail(false);
		setIsPreviewOpen(false);
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex-grow space-y-4 pb-20">
				<div className="flex items-center gap-2 border-b border-border">
					<Label htmlFor="from" className="w-24 text-muted-foreground">
						From
					</Label>
					<div className="flex items-center w-full gap-2">
						<Input
							id="from"
							placeholder="Name"
							value={broadcast.from_name}
							onChange={handleChange("from_name")}
							className="border-none rounded-none outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:ring-0 w-auto"
						/>
						<div className="flex items-center border-l border-border pl-2">
							<div className="relative inline-flex items-center">
								<Input
									id="from_email"
									placeholder="email"
									value={broadcast.from_email}
									onChange={handleChange("from_email")}
									className="border-none rounded-none outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:ring-0 px-0 w-[1ch] peer"
									style={{
										width: `${Math.max((broadcast.from_email?.length || 0) + 1, 5)}ch`,
									}}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2 border-b border-border">
					<Label htmlFor="subject" className="w-24 text-muted-foreground">
						Subject
					</Label>
					<Input
						id="subject"
						placeholder="Subject"
						value={broadcast.subject}
						onChange={handleChange("subject")}
						className="flex-grow border-none rounded-none outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:ring-0"
					/>
				</div>
				<div className="flex items-center gap-2 border-b border-border">
					<Label htmlFor="preview" className="w-24 text-muted-foreground">
						Preview
					</Label>
					<Input
						id="preview"
						placeholder="Preview"
						value={broadcast.preview || ""}
						onChange={handleChange("preview")}
						className="flex-grow border-none rounded-none outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:ring-0"
					/>
				</div>
				<Editor
					className="min-h-[420px]"
					defaultValue={broadcast.content}
					onUpdate={(editor) => {
						const html = editor?.getHTML() || "";
						const updatedBroadcast = { ...broadcast, content: html };
						setBroadcast(updatedBroadcast);
						debouncedSave(updatedBroadcast);
					}}
					uploadOptions={{
						path: `${broadcast.id}`,
					}}
				/>
			</div>
			<div className="sticky bottom-0 left-0 right-0 bg-background border-t border-border p-4 flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button disabled={!broadcast.subject || !broadcast.content}>
								Send Broadcast
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Select Contacts</DialogTitle>
							</DialogHeader>
							<ListSelector
								onChange={(selectedLists) => setSelectedLists(selectedLists)}
							/>
							<ContactSelector
								onChange={(selectedContacts) =>
									setSelectedContacts(selectedContacts)
								}
							/>
							<SubmitButton
								isSubmitting={isSendingEmail}
								onClick={() => handleSend(selectedContacts)}
							>
								{isSendingEmail ? "Sending..." : "Send"}
							</SubmitButton>
						</DialogContent>
					</Dialog>

					<Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								disabled={!broadcast.subject || !broadcast.content}
							>
								Send test email
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Send test email</DialogTitle>
							</DialogHeader>
							<Input
								placeholder="Email"
								value={testEmail}
								onChange={(e) => setTestEmail(e.target.value)}
							/>
							<SubmitButton
								isSubmitting={isSendingEmail}
								onClick={() => handleSendTestEmail(testEmail)}
							>
								{isSendingEmail ? "Sending..." : "Send"}
							</SubmitButton>
						</DialogContent>
					</Dialog>
				</div>

				<div className="flex items-center space-x-2">
					<div
						className={cn(
							"w-2 h-2 rounded-full transition-all duration-700",
							savingStatus === "saving" &&
								"bg-green-500 animate-[pulse_2s_ease-in-out_infinite]",
							savingStatus === "saved" && "bg-green-500",
							savingStatus === "idle" && "bg-gray-300",
						)}
					/>
					<span className="text-sm text-muted-foreground">
						{savingStatus === "saving" && "Saving"}
						{savingStatus === "saved" && "Saved"}
						{savingStatus === "idle" && "Not saved"}
					</span>
				</div>
			</div>
		</div>
	);
}
