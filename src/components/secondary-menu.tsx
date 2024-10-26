"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SecondaryMenu({
	items,
}: { items: { path: string; label: string }[] }) {
	const pathname = usePathname();

	return (
		<nav className="py-4 -mx-3 w-full">
			<ul className="flex space-x-4 text-sm scrollbar-hide">
				{items.map((item: { path: string; label: string }) => (
					<li key={item.path}>
						<Link
							prefetch
							href={item.path}
							className={cn(
								"bg-transparent p-2 px-3 rounded-md text-muted-foreground hover:text-foreground",
								pathname === item.path &&
									"bg-primary/80 text-primary-foreground font-medium",
							)}
						>
							<span>{item.label}</span>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
