"use client";

import { useRouter } from "next/navigation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteInvitationAction } from "@/actions/delete-invitation";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface Invitation {
	id: string;
	email: string;
	role: string;
	created_at: string;
}

interface InvitationsTableProps {
	invitations: Invitation[];
}

export function InvitationsTable({ invitations }: InvitationsTableProps) {
	const router = useRouter();

	const handleDelete = async (id: string) => {
		// const result = await deleteInvitationAction({ id });
		// if (result.success) {
		// 	toast({
		// 		title: "Invitation deleted",
		// 		description: "The invitation has been successfully deleted.",
		// 	});
		// 	router.refresh();
		// } else {
		// 	toast({
		// 		title: "Error",
		// 		description:
		// 			result.error || "An error occurred while deleting the invitation.",
		// 		variant: "destructive",
		// 	});
		// }
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Invited At</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{invitations.map((invitation) => (
					<TableRow key={invitation.id}>
						<TableCell>{invitation.email}</TableCell>
						<TableCell>{invitation.role}</TableCell>
						<TableCell>
							{format(new Date(invitation.created_at), "PPpp")}
						</TableCell>
						<TableCell>
							{/* <Button>Resend invite</Button> */}
							<Button
								variant="destructive"
								onClick={() => handleDelete(invitation.id)}
							>
								Revoke invite
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
