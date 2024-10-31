"use client";

import { cn } from "@/lib/utils";
export default function BubbleMenuButton({
	action,
	isActive,
	children,
	className,
}: {
	action: () => void;
	isActive: boolean;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<button
			type="button"
			onClick={action}
			className={cn(
				"px-2.5 py-1.5 text-xs tracking-tight leading-none font-mono transition-colors text-muted-foreground bg-transparent hover:bg-muted/50 flex items-center gap-1",
				className,
			)}
		>
			{children}
		</button>
	);
}
