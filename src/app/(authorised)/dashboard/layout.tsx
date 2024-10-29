// import { Sidebar } from "@/components/sidebar";
import { getUser } from "@/lib/supabase/queries/user.cached";
import { redirect } from "next/navigation";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	if (!user.data?.account_id) {
		redirect("/onboarding");
	}

	return (
		<SidebarProvider>
			<AppSidebar user={user} />
			<SidebarInset className="w-full">{children}</SidebarInset>
		</SidebarProvider>
	);
}
