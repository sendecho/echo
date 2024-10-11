import React from "react";
import { Sidebar } from "@/components/sidebar";
import { getUser } from "@/lib/supabase/queries/user.cached";
import { redirect } from "next/navigation";

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
		<div className="flex h-screen">
			<Sidebar />
			<main className="flex-1 overflow-y-auto">{children}</main>
		</div>
	);
}
