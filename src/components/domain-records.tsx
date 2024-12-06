"use client";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ClipboardCopyIcon } from "lucide-react";

interface DomainRecordsProps {
	records: any[];
}

export default function DomainRecords({ records }: DomainRecordsProps) {
	const { toast } = useToast();

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast({ title: "Copied to clipboard", duration: 2000 });
	};

	return (
		<div>
			{records && (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Type</TableHead>
							<TableHead>Host/Name</TableHead>
							<TableHead>Value</TableHead>
							<TableHead>Priority</TableHead>
							<TableHead>TTL</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{records.map((record: any, index: number) => (
							<TableRow key={index}>
								<TableCell>{record.type}</TableCell>
								<TableCell>{record.name}</TableCell>
								<TableCell className="max-w-xs truncate">
									{record.value}
								</TableCell>
								<TableCell>{record?.priority}</TableCell>
								<TableCell>{record?.ttl}</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => copyToClipboard(record.value)}
									>
										<ClipboardCopyIcon className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
