import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmailEngagement {
	contact_email: string;
	first_name: string | null;
	last_name: string | null;
	sent_at: string;
	open_count: number;
	click_count: number;
	last_engaged_at: string | null;
}

interface LinkEngagement {
	link_url: string;
	unique_clicks: number;
	total_clicks: number;
	click_rate: number;
}

interface BroadcastStats {
	totalSent: number;
	sentAt: string | null;
	totalOpens: number;
	uniqueOpens: number;
	totalLinkClicks: number;
	uniqueLinkClicks: number;
	opens: EmailEngagement[];
	links: LinkEngagement[];
}

export function BroadcastAnalytics({ stats }: { stats: BroadcastStats }) {
	return (
		<div className="space-y-8">
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
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Opens</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalOpens}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Unique Opens</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.uniqueOpens}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Link Clicks
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalLinkClicks}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Unique Link Clicks
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.uniqueLinkClicks}</div>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="engagement" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="engagement">Engagement</TabsTrigger>
					<TabsTrigger value="links">Link Tracking</TabsTrigger>
				</TabsList>
				<TabsContent value="engagement" className="mt-4">
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[300px]">Contact</TableHead>
									<TableHead className="text-right w-[80px]">Opens</TableHead>
									<TableHead className="text-right w-[80px]">Clicks</TableHead>
									<TableHead className="hidden md:table-cell">
										Last Engaged
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{stats.opens.map((engagement) => (
									<TableRow key={engagement.contact_email}>
										<TableCell>
											<div>
												<div className="font-medium">
													{engagement.first_name} {engagement.last_name}
												</div>
												<div className="text-sm text-muted-foreground">
													{engagement.contact_email}
												</div>
											</div>
										</TableCell>
										<TableCell className="text-right">
											{engagement.open_count > 0 ? (
												<span className="text-green-600">
													{engagement.open_count}
												</span>
											) : (
												<span className="text-muted-foreground">0</span>
											)}
										</TableCell>
										<TableCell className="text-right">
											{engagement.click_count > 0 ? (
												<span className="text-blue-600">
													{engagement.click_count}
												</span>
											) : (
												<span className="text-muted-foreground">0</span>
											)}
										</TableCell>
										<TableCell className="hidden md:table-cell">
											{engagement.last_engaged_at
												? new Date(engagement.last_engaged_at).toLocaleString()
												: "-"}
										</TableCell>
									</TableRow>
								))}
								{stats.opens.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={4}
											className="text-center text-muted-foreground"
										>
											No engagement data available
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</TabsContent>
				<TabsContent value="links" className="mt-4">
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>URL</TableHead>
									<TableHead className="text-right whitespace-nowrap w-[120px]">
										Unique Clicks
									</TableHead>
									<TableHead className="text-right whitespace-nowrap w-[120px]">
										Total Clicks
									</TableHead>
									<TableHead className="text-right whitespace-nowrap w-[100px]">
										Click Rate
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{stats.links.map((link) => (
									<TableRow key={link.link_url}>
										<TableCell className="font-medium truncate max-w-[300px]">
											<a
												href={link.link_url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:underline"
											>
												{link.link_url}
											</a>
										</TableCell>
										<TableCell className="text-right">
											{link.unique_clicks}
										</TableCell>
										<TableCell className="text-right">
											{link.total_clicks}
										</TableCell>
										<TableCell className="text-right">
											{link.click_rate.toFixed(1)}%
										</TableCell>
									</TableRow>
								))}
								{stats.links.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={4}
											className="text-center text-muted-foreground"
										>
											No links have been clicked yet
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
