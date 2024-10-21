"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { inviteUserAction } from "@/actions/invite-user";
import { toast } from "@/components/ui/use-toast";

interface InviteUserDialogProps {
	accountId: string;
}

export function InviteUserDialog({ accountId }: InviteUserDialogProps) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<"owner" | "member">("member");
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const handleInvite = async () => {
		const result = await inviteUserAction({ email, role });

		if (result?.data?.success) {
			setIsOpen(false);
			setEmail("");
			setRole("member");
			toast({
				title: "Invitation sent",
				description: `An invitation has been sent to ${email}.`,
			});
			router.refresh();
		} else {
			toast({
				title: "Error",
				description:
					result?.data?.error ||
					"An error occurred while sending the invitation.",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Invite User</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite User</DialogTitle>
					<DialogDescription>Invite a user to your account</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<Input
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Select
						value={role}
						onValueChange={(value: "owner" | "member") => setRole(value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="member">Member</SelectItem>
							<SelectItem value="owner">Owner</SelectItem>
						</SelectContent>
					</Select>
					<Button onClick={handleInvite}>Send Invitation</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
