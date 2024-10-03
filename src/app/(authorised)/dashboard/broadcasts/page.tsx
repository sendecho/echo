import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BroadcastsTable } from "@/components/broadcasts-table";
import { TableSkeleton } from "@/components/table-skeleton";
import DashboardLayout from "@/components/layouts/dashboard-layout";

export default function BroadcastsPage() {
	return (
		<DashboardLayout>
			<div className="flex flex-col gap-8">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold">Broadcasts</h1>
					<Link href="/dashboard/broadcasts/new">
						<Button>Create New Broadcast</Button>
					</Link>
				</div>
				<Suspense fallback={<TableSkeleton />}>
					<BroadcastsTable />
				</Suspense>
			</div>
		</DashboardLayout>
	);
}
