import { SecondaryMenu } from "@/components/secondary-menu";
import DashboardLayout from "@/components/layouts/dashboard-layout";

export default function SettingsLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<DashboardLayout>
			<div className="flex flex-col gap-8">
				<SecondaryMenu
					items={[
						{ path: "/dashboard/settings", label: "General" },
						{ path: "/dashboard/settings/domain", label: "Domain" },
						{ path: "/dashboard/settings/people", label: "People" },
						{ path: "/dashboard/settings/billing", label: "Billing" },
						{ path: "/dashboard/settings/api-keys", label: "API Keys" },
					]}
				/>
				<main className="">{children}</main>
			</div>
		</DashboardLayout>
	);
}
