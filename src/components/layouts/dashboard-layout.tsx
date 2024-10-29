import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import React from "react";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface DashboardLayoutProps {
	children: React.ReactNode;
	breadcrumbs?: BreadcrumbItem[];
}

export default function DashboardLayout({
	children,
	breadcrumbs,
}: DashboardLayoutProps) {
	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2">
				<div className="flex items-center gap-2 px-4 sm:px-8">
					<SidebarTrigger />

					<Separator orientation="vertical" className="mx-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								{breadcrumbs ? (
									<BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
								) : (
									<BreadcrumbPage>Dashboard</BreadcrumbPage>
								)}
							</BreadcrumbItem>
							{breadcrumbs?.map((item, index) => (
								<React.Fragment key={index}>
									<BreadcrumbSeparator className="hidden md:block" />
									<BreadcrumbItem
										className={
											index < breadcrumbs?.length - 1 ? "hidden md:block" : ""
										}
									>
										{index < breadcrumbs?.length - 1 ? (
											<>
												<BreadcrumbLink href={item.href}>
													{item.label}
												</BreadcrumbLink>
											</>
										) : (
											<BreadcrumbPage>{item.label}</BreadcrumbPage>
										)}
									</BreadcrumbItem>
								</React.Fragment>
							))}
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<main>
				<div className="flex-1 p-4 sm:p-8 container mx-auto">{children}</div>
			</main>
		</>
	);
}
