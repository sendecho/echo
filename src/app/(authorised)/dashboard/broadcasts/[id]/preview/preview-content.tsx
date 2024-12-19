"use client";

import { BroadcastPreview } from "@/components/broadcast-preview";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type DeviceType = "mobile" | "tablet" | "desktop";

const deviceWidths: Record<DeviceType, { width: number; label: string }> = {
	mobile: { width: 375, label: "Mobile" },
	tablet: { width: 768, label: "Tablet" },
	desktop: { width: 1024, label: "Desktop" },
};

interface PreviewContentProps {
	broadcast: {
		subject: string;
		content: string;
	};
}

export function PreviewContent({ broadcast }: PreviewContentProps) {
	const [device, setDevice] = useState<DeviceType>("desktop");

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">
						Preview: {broadcast.subject || "Untitled Broadcast"}
					</h1>
					<p className="text-sm text-muted-foreground">
						Viewing at {deviceWidths[device].width}px (
						{deviceWidths[device].label})
					</p>
				</div>
				<ToggleGroup
					type="single"
					value={device}
					onValueChange={(value) => value && setDevice(value as DeviceType)}
				>
					<ToggleGroupItem value="mobile" aria-label="Mobile view">
						<Smartphone className="h-4 w-4" />
					</ToggleGroupItem>
					<ToggleGroupItem value="tablet" aria-label="Tablet view">
						<Tablet className="h-4 w-4" />
					</ToggleGroupItem>
					<ToggleGroupItem value="desktop" aria-label="Desktop view">
						<Monitor className="h-4 w-4" />
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
			<div className="flex justify-center overflow-hidden">
				<motion.div
					layout
					initial={false}
					animate={{
						width: device === "desktop" ? "100%" : deviceWidths[device].width,
					}}
					transition={{
						type: "spring",
						stiffness: 200,
						damping: 30,
						delay: 0.2,
					}}
					className={cn(
						"relative",
						device !== "desktop" && "border-x border-border shadow-sm",
					)}
					style={{
						maxWidth: "896px", // max-w-4xl equivalent
					}}
				>
					<div className="relative">
						<BroadcastPreview
							subject={broadcast.subject}
							content={broadcast.content}
						/>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
