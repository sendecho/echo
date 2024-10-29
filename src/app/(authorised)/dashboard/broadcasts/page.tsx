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
	const breadcrumbs = [{ label: "Broadcasts" }];

	return (
		<DashboardLayout breadcrumbs={breadcrumbs}>
			<div className="flex flex-col">
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
