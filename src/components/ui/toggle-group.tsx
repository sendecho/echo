"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroup = React.forwardRef<
	React.ElementRef<typeof ToggleGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
	<ToggleGroupPrimitive.Root
		ref={ref}
		className={cn("inline-flex bg-muted p-1 rounded-md", className)}
		{...props}
	/>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
	React.ElementRef<typeof ToggleGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<ToggleGroupPrimitive.Item
		ref={ref}
		className={cn(
			toggleVariants({
				variant: "outline",
				size: "sm",
			}),
			className,
		)}
		{...props}
	>
		{children}
	</ToggleGroupPrimitive.Item>
));

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
