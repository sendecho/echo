import type { Editor } from "@tiptap/core";
import type { UploadOptions } from "../image-upload";
import {
	BoldButton,
	ItalicButton,
	CodeButton,
	HighlightButton,
} from "./FormatOptions";
import { ImageSelector } from "./ImageSelector";
import NodeSelector from "./NodeSelector";
import VariableSelector from "./VariableSelector";

interface ToolbarProps {
	editor: Editor;
	uploadOptions?: UploadOptions;
}

const Toolbar = ({ editor, uploadOptions }: ToolbarProps) => {
	return (
		<div className="bg-background z-10 sticky top-2 shadow-sm border border-border rounded-md p-2 mb-4">
			<div className="flex items-center space-x-2">
				<NodeSelector editor={editor} />
				<BoldButton editor={editor} />
				<ItalicButton editor={editor} />
				<CodeButton editor={editor} />
				<HighlightButton editor={editor} />
				<ImageSelector editor={editor} uploadOptions={uploadOptions} />
				<VariableSelector editor={editor} />
			</div>
		</div>
	);
};

export default Toolbar;
