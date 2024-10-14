import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { BroadcastsTable } from "@/components/broadcasts-table";
import { TableSkeleton } from "@/components/table-skeleton";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import CreateBroadcastButton from "@/components/create-broadcast-button";
import { PageHeader } from "@/components/page-header";

export const metadata = {
	title: "Broadcasts",
	description: "Create and manage your broadcasts",
};

export default function BroadcastsPage() {
	return (
		<DashboardLayout>
			<div className="flex flex-col gap-8">
				<PageHeader
					title="Broadcasts"
					description="Create and manage your broadcasts"
					actions={[<CreateBroadcastButton key="create-broadcast-button" />]}
				/>
				<Suspense fallback={<TableSkeleton />}>
					<BroadcastsTable />
				</Suspense>
			</div>
		</DashboardLayout>
	);
}
