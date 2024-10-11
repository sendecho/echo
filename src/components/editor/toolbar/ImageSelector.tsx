import { useRef } from "react";
import type { Editor } from "@tiptap/core";
import { Image } from "lucide-react";
import { uploadFn } from "../image-upload";
import { toast } from "sonner";
import type { UploadOptions } from "../image-upload";

interface ImageSelectorProps {
	editor: Editor;
	uploadOptions?: UploadOptions;
}

export function ImageSelector({ editor, uploadOptions }: ImageSelectorProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageUpload = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const upload = uploadFn(uploadOptions || {});

		try {
			const publicUrl = await new Promise<string>((resolve, reject) => {
				upload(file, editor.view, editor.state.selection.from);

				// Listen for the image insertion in the editor
				const unsubscribe = editor.on("update", ({ editor }) => {
					const images = editor
						.getJSON()
						.content?.filter((node) => node.type === "image");
					const lastImage = images?.[images.length - 1];
					if (
						lastImage?.attrs?.src &&
						!lastImage.attrs.src.startsWith("data:")
					) {
						unsubscribe();
						resolve(lastImage.attrs.src);
					}
				});
			});

			toast.success("Image uploaded successfully");
		} catch (error) {
			console.error("Error uploading image:", error);
			toast.error("Failed to upload image");
		}
	};

	return (
		<div>
			<button
				type="button"
				onClick={() => fileInputRef.current?.click()}
				className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
				title="Insert image"
			>
				<Image className="w-5 h-5" />
			</button>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleImageUpload}
				accept="image/*"
				className="hidden"
				aria-label="Upload image"
			/>
		</div>
	);
}
