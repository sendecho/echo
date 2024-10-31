"use client";

import type { Editor } from "@tiptap/react";
import { useClickAway } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import { useState } from "react";
import {
	MdOutlineAutoAwesome,
	MdOutlineCloseFullscreen,
	MdOutlineSpellcheck,
	MdOutlineWrapText,
} from "react-icons/md";
import BubbleMenuButton from "./bubble-menu-button";
import { useCompletion } from "ai/react";

const selectors = [
	{
		name: "Grammar",
		icon: MdOutlineSpellcheck,
		instructions:
			"Fix grammar: Rectify any grammatical errors while preserving the original meaning.",
	},
	{
		name: "Improve",
		icon: MdOutlineWrapText,
		instructions:
			"Improve text: Refine the text to improve clarity and professionalism.",
	},
	{
		name: "Condense",
		icon: MdOutlineCloseFullscreen,
		instructions:
			"Condense text: Remove any unnecessary text and only keep the invoice-related content and make it more concise.",
	},
];

interface AIMenuProps {
	editor: Editor;
	onOpenChange: (open: boolean) => void;
}

function formatEditorContent(content: string): string {
	return content.replace(/\n/g, "<br />");
}

export function AIMenu({ onOpenChange, editor }: AIMenuProps) {
	const [isTypingPrompt, setIsTypingPrompt] = useState(false);

	const ref = useClickAway<HTMLDivElement>(() => {
		onOpenChange(false);
		setIsTypingPrompt(false);
	});

	const { complete } = useCompletion({
		api: "/api/editor/ai",
	});

	const handleGenerate = async (instructions: string) => {
		const selectedText = editor?.state.doc.textBetween(
			editor?.state.selection?.from,
			editor?.state.selection?.to,
			"",
		);

		if (!selectedText) {
			return;
		}

		try {
			const result = await complete(instructions, {
				body: {
					context: selectedText,
				},
			});

			editor?.commands.insertContent(formatEditorContent(result ?? ""));
		} catch (error) {
			console.error("Error generating content:", error);
		}
	};

	return (
		<div ref={ref} className="flex whitespace-nowrap divide-x">
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.2 }}
			>
				{isTypingPrompt ? (
					<div className="relative">
						<input
							autoFocus
							placeholder="Type your prompt…"
							onBlur={() => setIsTypingPrompt(false)}
							className="w-[280px] text-sm border-none px-4 h-8 bg-background focus:outline-none"
							onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
								if (e.key === "Enter") {
									e.preventDefault();
									onOpenChange(false);
									handleGenerate(`Custom prompt: ${e.target.value}`);
								}
							}}
						/>
						<kbd className="pointer-events-none h-5 select-none items-center gap-1 px-1.5 font-mono text-[13px] font-medium absolute right-2 top-1/2 -translate-y-1/2">
							<span>↵</span>
						</kbd>
					</div>
				) : (
					<BubbleMenuButton
						action={() => setIsTypingPrompt(true)}
						isActive={false}
					>
						<div className="flex items-center gap-1">
							<MdOutlineAutoAwesome className="size-4" />
							<span>Ask AI</span>
						</div>
					</BubbleMenuButton>
				)}
			</motion.div>

			{!isTypingPrompt &&
				selectors.map((selector, index) => (
					<motion.div
						key={selector.name}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2, delay: (index + 1) * 0.05 }}
					>
						<BubbleMenuButton
							action={() => handleGenerate(selector.instructions)}
							isActive={false}
						>
							<div className="flex items-center space-x-1">
								<selector.icon className="size-3" />
								<span>{selector.name}</span>
							</div>
						</BubbleMenuButton>
					</motion.div>
				))}
		</div>
	);
}
