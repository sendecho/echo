import { notFound } from "next/navigation";
import {
	fetchBroadcastById,
	getBroadcastStats,
} from "@/lib/supabase/queries/broadcasts";
import { BroadcastEditor } from "@/components/broadcast-editor";
import { BroadcastAnalytics } from "@/components/broadcast-analytics";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { createClient } from "@/lib/supabase/server";

export const generateMetadata = async ({
	params,
}: { params: { id: string } }) => {
	const broadcast = await fetchBroadcastById(params.id);
	return {
		title: broadcast.subject ? `${broadcast.subject}` : "Broadcast Details",
		description: broadcast.preview
			? broadcast.preview
			: "View the details of a broadcast",
	};
};

export default async function BroadcastPage({
	params,
}: { params: { id: string } }) {
	const supabase = createClient();
	const broadcast = await fetchBroadcastById(params.id);

	if (!broadcast) {
		notFound();
	}

	const isSent = !!broadcast.sent_at;
	const stats = isSent ? await getBroadcastStats(supabase, params.id) : null;

	const breadcrumbs = [
		{ label: "Broadcasts", href: "/dashboard/broadcasts" },
		{ label: broadcast.subject || "New Broadcast" },
	];

	return (
		<DashboardLayout breadcrumbs={breadcrumbs}>
			<h1 className="text-2xl font-bold mb-6">{broadcast.subject}</h1>
			{isSent ? (
				<BroadcastAnalytics stats={stats!} />
			) : (
				<BroadcastEditor initialBroadcast={broadcast} />
			)}
		</DashboardLayout>
	);
}
