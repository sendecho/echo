import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BroadcastStats {
	totalSent: number;
	sentAt: string | null;
}

export function BroadcastAnalytics({ stats }: { stats: BroadcastStats }) {
	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Sent</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.sentAt
								? new Date(stats.sentAt).toLocaleString()
								: "Not sent yet"}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Emails Sent
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalSent}</div>
					</CardContent>
				</Card>

				{/* Add more cards for other stats as needed */}
			</div>
		</div>
	);
}
