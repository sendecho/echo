import { notFound } from "next/navigation";
import { fetchBroadcastById } from "@/lib/supabase/queries/broadcasts";
import { BroadcastPreview } from "@/components/broadcast-preview";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { PreviewContent } from "./preview-content";

export const generateMetadata = async ({
	params,
}: { params: { id: string } }) => {
	const broadcast = await fetchBroadcastById(params.id);
	return {
		title: broadcast.subject
			? `Preview: ${broadcast.subject}`
			: "Preview Broadcast",
		description: broadcast.preview
			? broadcast.preview
			: "Preview how your broadcast will look",
	};
};

export default async function BroadcastPreviewPage({
	params,
}: { params: { id: string } }) {
	const broadcast = await fetchBroadcastById(params.id);

	if (!broadcast) {
		notFound();
	}

	const breadcrumbs = [
		{ label: "Broadcasts", href: "/dashboard/broadcasts" },
		{
			label: broadcast.subject || "New Broadcast",
			href: `/dashboard/broadcasts/${params.id}`,
		},
		{ label: "Preview" },
	];

	return (
		<DashboardLayout breadcrumbs={breadcrumbs}>
			<PreviewContent broadcast={broadcast} />
		</DashboardLayout>
	);
}
