import type { Editor } from "@tiptap/core";
import {
	BoldButton,
	ItalicButton,
	CodeButton,
	HighlightButton,
} from "./FormatOptions";
import ImageSelector from "./ImageSelector";
import NodeSelector from "./NodeSelector";
import VariableSelector from "./VariableSelector";

const Toolbar = ({ editor }: { editor: Editor }) => {
	return (
		<div className="border border-border rounded-md p-2 mb-4">
			<div className="flex items-center space-x-2">
				<NodeSelector editor={editor} />
				<BoldButton editor={editor} />
				<ItalicButton editor={editor} />
				<CodeButton editor={editor} />
				<HighlightButton editor={editor} />
				<ImageSelector editor={editor} />
				<VariableSelector editor={editor} />
			</div>
		</div>
	);
};

export default Toolbar;
