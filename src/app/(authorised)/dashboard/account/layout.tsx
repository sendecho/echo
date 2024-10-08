import DashboardLayout from "@/components/layouts/dashboard-layout";
import { SecondaryMenu } from "@/components/secondary-menu";

export default function AccountLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<DashboardLayout>
			<main className="flex-1">{children}</main>
		</DashboardLayout>
	);
}
