import React from "react";
import { Editor } from "@tiptap/react";
import { Check, ChevronDown } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import BubbleMenuButton from "./bubble-menu-button";

interface NodeSelectorProps {
	editor: Editor;
}

const nodeTypes = [
	{
		name: "Paragraph",
		command: (editor: Editor) => editor.chain().focus().setParagraph().run(),
	},
	{
		name: "Heading 1",
		command: (editor: Editor) =>
			editor.chain().focus().toggleHeading({ level: 1 }).run(),
	},
	{
		name: "Heading 2",
		command: (editor: Editor) =>
			editor.chain().focus().toggleHeading({ level: 2 }).run(),
	},
	{
		name: "Heading 3",
		command: (editor: Editor) =>
			editor.chain().focus().toggleHeading({ level: 3 }).run(),
	},
	{
		name: "Bullet List",
		command: (editor: Editor) =>
			editor.chain().focus().toggleBulletList().run(),
	},
	{
		name: "Numbered List",
		command: (editor: Editor) =>
			editor.chain().focus().toggleOrderedList().run(),
	},
	{
		name: "Code Block",
		command: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
	},
];

const NodeSelector: React.FC<NodeSelectorProps> = ({ editor }) => {
	const [open, setOpen] = React.useState(false);

	const activeNode = React.useMemo(() => {
		if (editor.isActive("paragraph")) return "Paragraph";
		if (editor.isActive("heading", { level: 1 })) return "Heading 1";
		if (editor.isActive("heading", { level: 2 })) return "Heading 2";
		if (editor.isActive("heading", { level: 3 })) return "Heading 3";
		if (editor.isActive("bulletList")) return "Bullet List";
		if (editor.isActive("orderedList")) return "Numbered List";
		if (editor.isActive("codeBlock")) return "Code Block";
		return "Paragraph";
	}, [editor.state]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<BubbleMenuButton action={() => {}} isActive={false}>
					{activeNode}
					<ChevronDown className="w-4 h-4" />
				</BubbleMenuButton>
			</PopoverTrigger>
			<PopoverContent className="bg-background text-foreground text-sm font-mono rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-1 w-40">
				<div className="py-1">
					{nodeTypes.map((node) => (
						<button
							key={node.name}
							type="button"
							onClick={() => {
								node.command(editor);
								setOpen(false);
							}}
							className="flex items-center justify-between w-full px-2 py-1 text-left text-sm tracking-normal text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-md"
						>
							{node.name}
							{node.name === activeNode && <Check className="w-4 h-4" />}
						</button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default NodeSelector;
