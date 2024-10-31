import type React from "react";
import type { Editor } from "@tiptap/core";
import { Bold, Italic, Code, Highlighter } from "lucide-react";

interface FormatButtonProps {
	editor: Editor;
	format: "bold" | "italic" | "code" | "highlight";
}

const FormatButton: React.FC<FormatButtonProps> = ({ editor, format }) => {
	const isActive = editor.isActive(format);

	const handleClick = () => {
		switch (format) {
			case "bold":
				editor.chain().focus().toggleBold().run();
				break;
			case "italic":
				editor.chain().focus().toggleItalic().run();
				break;
			case "code":
				editor.chain().focus().toggleCode().run();
				break;
			case "highlight":
				editor.chain().focus().toggleHighlight().run();
				break;
		}
	};

	const getIcon = () => {
		switch (format) {
			case "bold":
				return <Bold className="w-5 h-5" />;
			case "italic":
				return <Italic className="w-5 h-5" />;
			case "code":
				return <Code className="w-5 h-5" />;
			case "highlight":
				return <Highlighter className="w-5 h-5" />;
		}
	};
	return (
		<button
			type="button"
			onClick={handleClick}
			className={`p-2 rounded-md ${
				isActive
					? "text-primary bg-primary/10"
					: "text-foreground hover:bg-muted"
			}`}
			title={`Toggle ${format}`}
		>
			{getIcon()}
		</button>
	);
};

export const BoldButton: React.FC<{ editor: Editor }> = ({ editor }) => (
	<FormatButton editor={editor} format="bold" />
);

export const ItalicButton: React.FC<{ editor: Editor }> = ({ editor }) => (
	<FormatButton editor={editor} format="italic" />
);

export const CodeButton: React.FC<{ editor: Editor }> = ({ editor }) => (
	<FormatButton editor={editor} format="code" />
);

export const HighlightButton: React.FC<{ editor: Editor }> = ({ editor }) => (
	<FormatButton editor={editor} format="highlight" />
);
