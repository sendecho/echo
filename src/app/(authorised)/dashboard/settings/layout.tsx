import { SecondaryMenu } from "@/components/secondary-menu";
import DashboardLayout from "@/components/layouts/dashboard-layout";

export default function SettingsLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<DashboardLayout>
			<div className="flex flex-col gap-8">
				<h1 className="text-3xl font-bold">Settings</h1>
				<SecondaryMenu
					items={[
						{ path: "/dashboard/settings", label: "General" },
						{ path: "/dashboard/settings/billing", label: "Billing" },
						{ path: "/dashboard/settings/api-keys", label: "API Keys" },
					]}
				/>
				<main className="">{children}</main>
			</div>
		</DashboardLayout>
	);
}
