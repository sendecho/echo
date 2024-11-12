import * as React from "react";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { uploadFn } from "../image-upload";
import { useState } from "react";

interface ImageEditBlockProps {
	editor: Editor;
	close: () => void;
}

export const ImageEditBlock: React.FC<ImageEditBlockProps> = ({
	editor,
	close,
}) => {
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [link, setLink] = React.useState("");
	const [isUploading, setIsUploading] = useState(false);

	const handleClick = React.useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleFile = React.useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (!files?.length) return;

			setIsUploading(true);

			const insertImages = async () => {
				const filesArray = Array.from(files);
				const imageUploader = uploadFn({ bucket: "images", path: "email" });

				try {
					for (const file of filesArray) {
						const publicUrl = await imageUploader.onUpload(file);
						editor
							.chain()
							.focus()
							.setImage({
								src: publicUrl,
								alt: file.name,
							})
							.run();
					}
				} catch (error) {
					console.error("Error uploading images:", error);
				} finally {
					setIsUploading(false);
				}
			};

			await insertImages();
			close();
		},
		[editor, close],
	);

	const handleSubmit = React.useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			e.stopPropagation();

			if (link) {
				editor.chain().focus().setImage({ src: link }).run();
				close();
			}
		},
		[editor, link, close],
	);

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-1">
				<Label htmlFor="image-link">Attach an image link</Label>
				<div className="flex">
					<Input
						id="image-link"
						type="url"
						required
						placeholder="https://example.com"
						value={link}
						className="grow"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setLink(e.target.value)
						}
					/>
					<Button type="submit" className="ml-2">
						Submit
					</Button>
				</div>
			</div>
			<Button type="button" className="w-full" onClick={handleClick}>
				Upload from your computer
			</Button>
			<input
				type="file"
				accept="image/*"
				ref={fileInputRef}
				multiple
				className="hidden"
				onChange={handleFile}
				disabled={isUploading}
				aria-label="Upload images"
			/>
			{isUploading && <div>Uploading...</div>}
		</form>
	);
};

export default ImageEditBlock;
