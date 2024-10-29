"use client";

import * as React from "react";
import { BookOpen, Home, LifeBuoy, Send, Settings2, Users } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { getUser } from "@/lib/supabase/queries/user.cached";
import { WorkspaceSwitcher } from "@/components/sidebar/workspace-switcher";
import Image from "next/image";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Home",
			url: "/dashboard",
			icon: Home,
		},
		{
			title: "Broadcasts",
			url: "/dashboard/broadcasts",
			icon: Send,
		},
		{
			title: "Contacts",
			url: "/dashboard/contacts",
			icon: Users,
		},
		{
			title: "Lists",
			url: "/dashboard/lists",
			icon: BookOpen,
		},
		{
			title: "Settings",
			url: "/dashboard/settings",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "/dashboard/settings",
				},
				{
					title: "People",
					url: "/dashboard/settings/people",
				},
				{
					title: "Billing",
					url: "/dashboard/settings/billing",
				},
				{
					title: "API Keys",
					url: "/dashboard/settings/api-keys",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Support",
			url: "mailto:hello@useecho.co",
			icon: LifeBuoy,
		},
		{
			title: "Feedback",
			url: "mailto:hello@useecho.co",
			icon: Send,
		},
	],
};

type User = Awaited<ReturnType<typeof getUser>>;

export function AppSidebar({
	user,
	...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<div className="flex items-center">
							<Image src="/echo.svg" alt="Echo" width={18} height={18} />
							<span className="ml-2 font-semibold text-lg">Echo</span>
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
				<WorkspaceSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{
						full_name: user?.data?.full_name ?? "Unknown",
						email: user?.data?.email ?? "",
						avatar_url: user?.data?.avatar_url ?? "",
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	);
}
