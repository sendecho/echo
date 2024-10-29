import { Suspense } from "react";
import { AccountDetails } from "@/components/account/account-details";
import { AccountSkeleton } from "@/components/account/account-skeleton";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { getUser } from "@/lib/supabase/queries/user.cached";
import { PageHeader } from "@/components/page-header";

export const metadata = {
	title: "Account Details",
	description: "View and manage your account details",
};

export default async function AccountPage() {
	const { data: user, error } = await getUser();

	if (error) {
		console.error(error);
		return <div>Error fetching user data</div>;
	}

	const breadcrumbs = [{ label: "Account" }];

	return (
		<DashboardLayout breadcrumbs={breadcrumbs}>
			<div className="space-y-4">
				<PageHeader title="Your account" />

				<Suspense fallback={<AccountSkeleton />}>
					<AccountDetails initialData={user} />
				</Suspense>
			</div>
		</DashboardLayout>
	);
}
