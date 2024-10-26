export default function DashboardLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col h-screen">
			<div className="flex-1 p-8 container mx-auto">{children}</div>
		</div>
	);
}
