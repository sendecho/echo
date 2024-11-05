import {
	BubbleMenu as TiptapBubbleMenu,
	type BubbleMenuProps as TiptapBubbleMenuProps,
	isNodeSelection,
} from "@tiptap/react";
import {
	BoldIcon,
	ItalicIcon,
	HighlighterIcon,
	CodeIcon,
	Sparkles,
} from "lucide-react";
import NodeSelector from "./node-selector";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AIMenu } from "./ai-menu";
import BubbleMenuButton from "./bubble-menu-button";
import LinkSelector from "./link-selector";

export interface BubbleMenuItem {
	name: string;
	isActive: () => boolean;
	command: () => void;
	icon: typeof BoldIcon;
}

type BubbleMenuProps = Omit<TiptapBubbleMenuProps, "children">;

export const BubbleMenu = (props: BubbleMenuProps) => {
	const [showAI, setShowAI] = useState(false);

	const { editor } = props;

	if (!editor) return null;

	const items: BubbleMenuItem[] = [
		{
			name: "Bold",
			isActive: () => editor.isActive("bold"),
			command: () => editor.chain().focus().toggleBold().run(),
			icon: BoldIcon,
		},
		{
			name: "Italic",
			isActive: () => editor.isActive("italic"),
			command: () => editor.chain().focus().toggleItalic().run(),
			icon: ItalicIcon,
		},
		{
			name: "Highlight",
			isActive: () => editor.isActive("highlight"),
			command: () => editor.chain().focus().toggleHighlight().run(),
			icon: HighlighterIcon,
		},
		{
			name: "Code",
			isActive: () => editor.isActive("code"),
			command: () => editor.chain().focus().toggleCode().run(),
			icon: CodeIcon,
		},
	];

	const bubbleMenuProps: BubbleMenuProps = {
		...props,
		shouldShow: ({ state, editor }) => {
			const { selection } = state;
			const { empty } = selection;

			// if editor is not editable, don't show the bubble menu
			// if selection is empty, don't show the bubble menu
			// if selection is a node selection, don't show the bubble menu
			if (!editor.isEditable || empty || isNodeSelection(selection)) {
				return false;
			}

			return true;
		},
	};

	return (
		<TiptapBubbleMenu
			{...bubbleMenuProps}
			className="flex w-fit divide-x rounded-full border border-border bg-background text-mono font-regular shadow-xl overflow-hidden"
		>
			{showAI ? (
				<AIMenu editor={editor} onOpenChange={setShowAI} />
			) : (
				<>
					<BubbleMenuButton action={() => setShowAI(true)} isActive={false}>
						<Sparkles className="w-4 h-4" />
						<span>Ask AI</span>
					</BubbleMenuButton>
					<NodeSelector editor={editor} />
					<div className="flex">
						{items.map((item) => (
							<BubbleMenuButton
								key={item.name}
								action={item.command}
								isActive={item.isActive()}
								tooltip={item.name}
							>
								<item.icon
									className={cn(
										"w-4 h-4",
										item.isActive() ? "text-primary" : "text-muted-foreground",
									)}
								/>
								<span className="sr-only">{item.name}</span>
							</BubbleMenuButton>
						))}
					</div>
					<LinkSelector editor={editor} />
				</>
			)}
		</TiptapBubbleMenu>
	);
};

export default BubbleMenu;
