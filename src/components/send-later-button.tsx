"use client";

import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Clock, ChevronLeft } from "lucide-react";
import { format, addHours, setHours, setMinutes, nextMonday } from "date-fns";

interface SendLaterButtonProps {
	onScheduleSend: (date: Date) => void;
	buttonProps?: ButtonProps;
}

export default function SendLaterButton({
	onScheduleSend,
	buttonProps,
}: SendLaterButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [showCalendar, setShowCalendar] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);

	const predefinedOptions = [
		{ label: "In 1 hour", value: addHours(new Date(), 1) },
		{
			label: "Tomorrow morning",
			value: setHours(setMinutes(addHours(new Date(), 24), 0), 9),
		},
		{ label: "Next Monday", value: setHours(nextMonday(new Date()), 9) },
		{ label: "Custom", value: "custom" },
	];

	const handleOptionSelect = (option: Date | "custom") => {
		if (option === "custom") {
			setShowCalendar(true);
			setSelectedDate(null);
			setSelectedTime(null);
		} else {
			setSelectedDate(option);
			setSelectedTime(format(option, "HH:mm"));
			setShowConfirmation(true);
		}
	};

	const handleConfirm = () => {
		if (selectedDate && selectedTime) {
			const [hours, minutes] = selectedTime.split(":");
			const scheduledDate = new Date(selectedDate);
			scheduledDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
			onScheduleSend(scheduledDate);
			setIsOpen(false);
			resetState();
		}
	};

	const handleCancel = () => {
		resetState();
	};

	const handleBackToOptions = () => {
		resetState();
	};

	const resetState = () => {
		setSelectedDate(null);
		setSelectedTime(null);
		setShowCalendar(false);
		setShowConfirmation(false);
	};

	const isCustomDateTimeComplete = selectedDate && selectedTime;

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen} modal>
			<PopoverTrigger asChild>
				<Button variant="outline" {...buttonProps}>
					Send Later
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80" side="top" align="start">
				<div className="space-y-4">
					<div className="flex items-center justify-between mb-4">
						{showCalendar || showConfirmation ? (
							<>
								<Button
									variant="ghost"
									className="p-0"
									onClick={handleBackToOptions}
								>
									<ChevronLeft className="mr-2 h-4 w-4" />
									Back
								</Button>
								<h3 className="font-medium">Schedule Send</h3>
							</>
						) : (
							<h3 className="font-medium">Schedule Send</h3>
						)}
					</div>
					{!showCalendar && !showConfirmation ? (
						predefinedOptions.map((option) => (
							<Button
								key={option.label}
								variant="ghost"
								className="w-full justify-start"
								onClick={() => handleOptionSelect(option.value)}
							>
								{option.label}
							</Button>
						))
					) : showCalendar ? (
						<>
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={setSelectedDate}
								initialFocus
							/>
							<div className="flex items-center justify-between">
								<span className="flex items-center gap-2">
									<Clock className="h-4 w-4" />
									{selectedTime || "Select time"}
								</span>
								<input
									type="time"
									value={selectedTime || ""}
									onChange={(e) => setSelectedTime(e.target.value)}
									className="border rounded p-1"
								/>
							</div>
							<Button
								onClick={() => setShowConfirmation(true)}
								disabled={!isCustomDateTimeComplete}
								className="w-full"
							>
								Confirm Date & Time
							</Button>
						</>
					) : (
						<div className="text-center">
							<p className="mb-4">
								Confirm sending at:
								<br />
								<strong>
									{selectedDate &&
										selectedTime &&
										format(
											new Date(
												selectedDate.setHours(
													...(selectedTime.split(":").map(Number) as [
														number,
														number,
													]),
												),
											),
											"MMMM d, yyyy HH:mm",
										)}
								</strong>
							</p>
							<div className="flex justify-center space-x-4">
								<Button onClick={handleCancel} variant="outline">
									Cancel
								</Button>
								<Button onClick={handleConfirm}>Confirm</Button>
							</div>
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
