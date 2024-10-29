"use client";

import { ChevronsUpDown, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { SignOut } from "@/components/logout-button";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function NavUser({
	user,
}: {
	user: {
		full_name: string;
		email: string;
		avatar_url: string;
	};
}) {
	const { isMobile } = useSidebar();
	const { theme, setTheme } = useTheme();
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={user.avatar_url} alt={user.full_name} />
								<AvatarFallback className="rounded-lg">
									{user.full_name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{user.full_name}</span>
								<span className="truncate text-xs">{user.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={user.avatar_url} alt={user.full_name} />
									<AvatarFallback className="rounded-lg">
										{user.full_name.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{user.full_name}
									</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link
									href="/dashboard/account"
									className="flex items-center cursor-pointer"
								>
									<User className="mr-2 h-4 w-4" />
									<span>Account</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									href="/dashboard/settings"
									className="flex items-center cursor-pointer"
								>
									<Settings className="mr-2 h-4 w-4" />
									<span>Settings</span>
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuLabel>Theme</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => setTheme("dark")}
								className={cn(
									"cursor-pointer",
									theme === "dark" && "bg-accent",
								)}
							>
								Dark
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setTheme("light")}
								className={cn(
									"cursor-pointer",
									theme === "light" && "bg-accent",
								)}
							>
								Light
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setTheme("system")}
								className={cn(
									"cursor-pointer",
									theme === "system" && "bg-accent",
								)}
							>
								System
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<SignOut />
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
