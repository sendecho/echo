// ui/multi-select.tsx

"use client";

import { cn } from "@/lib/utils";
import { useRef, type PropsWithChildren } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { CirclePlusIcon, XIcon } from "lucide-react";
import { AnimatedSizeContainer } from "./animated-size-container";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

interface MultiSelectProps {
	title?: string;
	options: {
		label: string;
		value: string;
		icon?: React.ComponentType<{ className?: string }>;
	}[];
	selectedValues: Set<string>;
	onSelectionChange: (selectedValues: Set<string>) => void;
}

export function MultiSelect({
	title,
	options,
	selectedValues,
	onSelectionChange,
}: MultiSelectProps) {
	return (
		<Popover modal>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="h-8 border flex items-center justify-start w-full max-w-full overflow-hidden"
				>
					<CirclePlusIcon className="mr-2 h-4 w-4" />
					{title}
					{selectedValues.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal lg:hidden"
							>
								{selectedValues.size}
							</Badge>
							<div className="hidden space-x-1 min-w-0 grow truncate text-left lg:flex lg:flex-wrap lg:gap-1">
								{selectedValues.size > 2 ? (
									<Badge
										variant="secondary"
										className="rounded-sm px-1 font-normal"
									>
										{selectedValues.size} selected
									</Badge>
								) : (
									options
										.filter((option) => selectedValues.has(option.value))
										.map((option) => (
											<Badge
												variant="secondary"
												key={option.value}
												className="rounded-sm px-1 font-normal truncate max-w-[150px]"
											>
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[min(calc(100vw-2rem),400px)] relative p-0"
				align="start"
			>
				<AnimatedSizeContainer
					height
					style={{ transform: "translateZ(0)" }}
					transition={{ ease: "easeInOut", duration: 0.1 }}
				>
					<Command loop>
						<CommandInput
							placeholder={title}
							onKeyDown={(e) => {
								if (
									e.key === "Escape" ||
									(e.key === "Backspace" &&
										(e.target as HTMLInputElement).value === "")
								) {
									e.preventDefault();
									e.stopPropagation();
									onSelectionChange(new Set());
								}
							}}
						/>
						<Scroll>
							<CommandList>
								<CommandEmpty>No results found.</CommandEmpty>
								<CommandGroup>
									{options.map((option) => {
										const isSelected = selectedValues?.has(option.value);
										return (
											<CommandItem
												key={option.value}
												className="flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm data-[selected=true]:bg-muted"
												onSelect={() => {
													const newSelectedValues = new Set(selectedValues);
													if (isSelected) {
														newSelectedValues.delete(option.value);
													} else {
														newSelectedValues.add(option.value);
													}
													onSelectionChange(newSelectedValues);
												}}
											>
												<div
													className={cn(
														"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
														isSelected
															? "bg-primary text-primary-foreground"
															: "opacity-50 [&_svg]:invisible",
													)}
												>
													<XIcon className={cn("h-4 w-4")} />
												</div>
												{option.icon && (
													<option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
												)}
												<span className="grow truncate">{option.label}</span>
											</CommandItem>
										);
									})}
								</CommandGroup>
								{selectedValues.size > 0 && (
									<>
										<CommandSeparator />
										<CommandGroup>
											<CommandItem
												onSelect={() => onSelectionChange(new Set())}
												className="justify-center text-center"
											>
												Clear filters
											</CommandItem>
										</CommandGroup>
									</>
								)}
							</CommandList>
						</Scroll>
					</Command>
				</AnimatedSizeContainer>
			</PopoverContent>
		</Popover>
	);
}

const Scroll = ({ children }: PropsWithChildren) => {
	const ref = useRef<HTMLDivElement>(null);

	const { scrollProgress, updateScrollProgress } = useScrollProgress(ref);

	return (
		<>
			<div
				className="scrollbar-hide max-h-[min(50vh,250px)] w-screen overflow-y-scroll sm:w-auto"
				ref={ref}
				onScroll={updateScrollProgress}
			>
				{children}
			</div>
			{/* Bottom scroll fade */}
			<div
				className="pointer-events-none absolute bottom-0 left-0 hidden h-16 w-full rounded-b-lg bg-gradient-to-t from-white sm:block"
				style={{ opacity: 1 - Math.pow(scrollProgress, 2) }}
			></div>
		</>
	);
};
