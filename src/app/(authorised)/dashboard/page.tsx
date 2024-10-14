import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchBroadcasts } from "@/lib/supabase/queries/broadcasts";
import { TableSkeleton } from "@/components/table-skeleton";
import { PlusCircle } from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { getContacts } from "@/lib/supabase/queries/contacts.cached";

export const metadata = {
	title: "Dashboard",
};

async function RecentContacts() {
	const contacts = await getContacts();
	const recentContacts = contacts?.slice(0, 5);

	if (recentContacts?.length === 0) {
		return (
			<div className="text-center py-4">
				<p className="text-sm text-gray-500 mb-2">No contacts yet</p>
				<Link href="/dashboard/contacts">
					<Button variant="outline" size="sm">
						<PlusCircle className="mr-2 h-4 w-4" />
						Add your first contact
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<ul className="space-y-2">
			{recentContacts?.map((contact) => (
				<li key={contact.id} className="flex justify-between items-center">
					<span>{`${contact.first_name} ${contact.last_name}`}</span>
					<span className="text-sm text-gray-500">{contact.email}</span>
				</li>
			))}
		</ul>
	);
}

async function RecentBroadcasts() {
	const broadcasts = await fetchBroadcasts();
	const recentBroadcasts = broadcasts.slice(0, 5);

	if (recentBroadcasts.length === 0) {
		return (
			<div className="text-center py-4">
				<p className="text-sm text-gray-500 mb-2">No broadcasts yet</p>
				<Link href="/dashboard/broadcasts/new">
					<Button variant="outline" size="sm">
						<PlusCircle className="mr-2 h-4 w-4" />
						Create your first broadcast
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<ul className="space-y-2">
			{recentBroadcasts.map((broadcast) => (
				<li key={broadcast.id} className="flex justify-between items-center">
					<Link
						href={`/dashboard/broadcasts/${broadcast.id}`}
						className="hover:underline"
					>
						<span>{broadcast.subject}</span>
					</Link>
					<span className="text-sm text-gray-500">
						{new Date(broadcast.created_at).toLocaleDateString()}
					</span>
				</li>
			))}
		</ul>
	);
}

export default function Dashboard() {
	return (
		<DashboardLayout>
			<h1 className="text-3xl font-bold mb-6">Dashboard</h1>
			<div className="grid md:grid-cols-2 gap-6">
				<Card className="border-border">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Recent Contacts
						</CardTitle>
						<Link href="/dashboard/contacts">
							<Button variant="ghost">View all</Button>
						</Link>
					</CardHeader>
					<CardContent>
						<Suspense fallback={<TableSkeleton />}>
							<RecentContacts />
						</Suspense>
					</CardContent>
				</Card>
				<Card className="border-border">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Recent Broadcasts
						</CardTitle>
						<Link href="/dashboard/broadcasts">
							<Button variant="ghost">View all</Button>
						</Link>
					</CardHeader>
					<CardContent>
						<Suspense fallback={<TableSkeleton />}>
							<RecentBroadcasts />
						</Suspense>
					</CardContent>
				</Card>
			</div>
		</DashboardLayout>
	);
}
