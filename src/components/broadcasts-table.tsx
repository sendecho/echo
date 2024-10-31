import Link from "next/link";
import { fetchBroadcasts } from "@/lib/supabase/queries/broadcasts";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "./ui/table";
import { BroadcastTableActions } from "./broadcast-table-actions";
import CreateBroadcastButton from "./create-broadcast-button";

export async function BroadcastsTable() {
	const broadcasts = await fetchBroadcasts();

	if (broadcasts.length === 0) {
		return (
			<div className="text-center text-muted-foreground flex flex-col gap-4 p-36 border border-dashed border-border rounded-md">
				<p>No broadcasts found</p>
				<div>
					<CreateBroadcastButton />
				</div>
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Subject</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="w-[100px]">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{broadcasts.map((broadcast) => (
					<TableRow key={broadcast.id}>
						<TableCell>
							<Link
								href={`/dashboard/broadcasts/${broadcast.id}`}
								className="text-foreground font-bold hover:underline"
							>
								{broadcast.subject || "New broadcast"}
							</Link>
						</TableCell>
						<TableCell>
							{new Date(broadcast.created_at).toLocaleDateString()}
						</TableCell>
						<TableCell>
							<Badge variant={broadcast.sent_at ? "default" : "secondary"}>
								{broadcast.sent_at ? "Sent" : "Draft"}
							</Badge>
						</TableCell>
						<TableCell>
							<BroadcastTableActions
								id={broadcast.id}
								subject={broadcast.subject}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
