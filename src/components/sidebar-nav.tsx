"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Home,
	List,
	Users,
	Send,
	Settings as SettingsIcon,
} from "lucide-react";

const sidebarItems = [
	{ name: "Home", href: "/dashboard", icon: Home },
	{ name: "Broadcasts", href: "/dashboard/broadcasts", icon: Send },
	{ name: "Contacts", href: "/dashboard/contacts", icon: Users },
	{ name: "Lists", href: "/dashboard/lists", icon: List },
	{ name: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

export function SidebarNav() {
	const pathname = usePathname();

	function isActive(href: string): boolean {
		if (href === "/dashboard") {
			return pathname === href;
		}
		return pathname.startsWith(href);
	}

	return (
		<div className="flex flex-1">
			<div className="space-y-4">
				<div className="px-3 py-2">
					<div className="space-y-1">
						{sidebarItems.map((item) => (
							<Button
								key={item.href}
								variant={isActive(item.href) ? "default" : "ghost"}
								className={cn(
									"w-full justify-start transition-all duration-300 shadow-none hover:shadow-sm hover:text-green-900 dark:hover:text-white",
									isActive(item.href) &&
										"shadow-sm hover:text-primary-foreground dark:text-white",
								)}
								asChild
							>
								<Link href={item.href}>
									<item.icon className="mr-2 h-4 w-4" />
									{item.name}
								</Link>
							</Button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
