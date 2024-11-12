"use client";

import { Toggle } from "@/components/ui/toggle";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BubbleMenuButtonProps
	extends React.ComponentPropsWithoutRef<typeof Toggle> {
	action: () => void;
	isActive: boolean;
	children: React.ReactNode;
	className?: string;
	tooltip?: string;
	tooltipOptions?: React.ComponentPropsWithoutRef<typeof TooltipContent>;
}

export default function BubbleMenuButton({
	action,
	isActive,
	children,
	className,
	tooltip,
	tooltipOptions,
}: BubbleMenuButtonProps) {
	const toggleButton = (
		<Toggle
			size="sm"
			className={cn(
				"px-2.5 py-1.5 text-xs tracking-tight leading-none font-mono transition-colors text-muted-foreground bg-transparent hover:bg-muted/50 flex items-center gap-1 rounded-none",
				{ "bg-accent": isActive },
				className,
			)}
			onClick={action}
		>
			{children}
		</Toggle>
	);

	if (!tooltip) {
		return toggleButton;
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>{toggleButton}</TooltipTrigger>
			<TooltipContent {...tooltipOptions} className="text-xs px-2 py-1.5">
				{tooltip}
			</TooltipContent>
		</Tooltip>
	);
}
