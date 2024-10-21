import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getUser } from "@/lib/supabase/queries/user.cached";
import { fetchInvitations } from "@/lib/supabase/queries/invitations";
import { fetchAccountMembers } from "@/lib/supabase/queries/account-members";
import { InviteUserDialog } from "@/components/invite-user-dialog";
import { MembersTable } from "@/components/members-table";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";

const InvitationsTable = dynamic(
	() =>
		import("@/components/invitations-table").then(
			(mod) => mod.InvitationsTable,
		),
	{ ssr: false },
);

function InvitationsTableSkeleton() {
	return (
		<div className="space-y-2">
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
		</div>
	);
}

export default async function AccountMembersPage() {
	const user = await getUser();
	const accountId = user?.data?.account_id as string;
	const invitations = await fetchInvitations(accountId);
	const members = await fetchAccountMembers(accountId);

	return (
		<div className="space-y-12">
			<PageHeader
				title="People"
				description="Manage your team members and invitations"
				actions={[
					<InviteUserDialog key="invite-button" accountId={accountId} />,
				]}
			/>
			<div>
				<h2 className="text-2xl font-bold mb-4">Team Members</h2>
				<MembersTable
					members={members}
					currentUserId={user?.data?.id as string}
				/>
			</div>
			<div>
				<h2 className="text-2xl font-bold mb-4">Pending Invitations</h2>
				<Suspense fallback={<InvitationsTableSkeleton />}>
					<InvitationsTable invitations={invitations} />
				</Suspense>
			</div>
		</div>
	);
}
