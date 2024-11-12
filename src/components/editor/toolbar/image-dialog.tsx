import {
	Dialog,
	DialogTitle,
	DialogHeader,
	DialogContent,
	DialogTrigger,
	DialogDescription,
} from "@/components/ui/dialog";
import { ToolbarButton } from "./toolbar-button";
import { ImageIcon } from "lucide-react";
import type { Editor } from "@tiptap/react";
import ImageEditBlock from "./image-edit-block";
import { useState } from "react";
import type { UploadOptions } from "../image-upload";
const ImageDialog = ({
	editor,
	uploadOptions,
}: { editor: Editor; uploadOptions?: UploadOptions }) => {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<ToolbarButton
					isActive={editor.isActive("image")}
					tooltip="Image"
					aria-label="Image"
				>
					<ImageIcon className="w-5 h-5" />
				</ToolbarButton>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upload Image</DialogTitle>
					<DialogDescription>Upload an image to the editor</DialogDescription>
				</DialogHeader>
				<ImageEditBlock editor={editor} close={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
};

export default ImageDialog;
