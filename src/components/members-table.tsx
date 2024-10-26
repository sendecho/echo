"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Member {
	user_id: string;
	role: string;
	users: {
		id: string;
		full_name: string;
		email: string;
	};
}

interface MembersTableProps {
	members: Member[];
	currentUserId: string;
}

export function MembersTable({ members, currentUserId }: MembersTableProps) {
	const handleRemoveMember = async (userId: string) => {
		// Implement remove member functionality
		console.log("Remove member:", userId);
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{members.map((member) => (
					<TableRow key={member.user_id}>
						<TableCell>{member.users.full_name}</TableCell>
						<TableCell>{member.users.email}</TableCell>
						<TableCell>{member.role}</TableCell>
						<TableCell>
							{member.user_id !== currentUserId && (
								<Button
									variant="destructive"
									onClick={() => handleRemoveMember(member.user_id)}
								>
									Remove
								</Button>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
