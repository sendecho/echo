"use client";

import { BroadcastPreview } from "@/components/broadcast-preview";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Smartphone, Tablet, Monitor, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type DeviceType = "mobile" | "tablet" | "desktop";

const deviceWidths: Record<DeviceType, { width: number; label: string }> = {
	mobile: { width: 375, label: "Mobile" },
	tablet: { width: 768, label: "Tablet" },
	desktop: { width: 1024, label: "Desktop" },
};

const previewVariables = {
	first_name: "John",
	last_name: "Doe",
	email: "john@example.com",
	company_name: "Echo",
	support_email: "support@sendecho.co",
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
					<div className="flex items-center gap-2">
						<h1 className="text-2xl font-bold">
							Preview: {broadcast.subject || "Untitled Broadcast"}
						</h1>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Info className="h-4 w-4 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent className="max-w-sm">
									<p className="font-medium mb-2">Available Variables:</p>
									<ul className="text-sm space-y-1">
										{Object.entries(previewVariables).map(([key, value]) => (
											<li key={key} className="font-mono text-xs">
												<span className="text-muted-foreground">
													{"{{"}
													{key}
													{"}}"}
												</span>{" "}
												= <span className="text-foreground">{value}</span>
											</li>
										))}
									</ul>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
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
