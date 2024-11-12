import { LinkIcon, UnlinkIcon } from "lucide-react";
import BubbleMenuButton from "./bubble-menu-button";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Editor } from "@tiptap/react";
import { formatUrlWithProtocol } from "../utils";

export function LinkSelector({ editor }: { editor: Editor }) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const linkValue = editor.getAttributes("link").href;
	const inputRef = useRef<HTMLInputElement>(null);
	const handleSubmit = () => {
		const url = formatUrlWithProtocol(value);

		if (url) {
			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: url })
				.run();

			setOpen(false);
		}
	};

	return (
		<Popover modal={false} open={open} onOpenChange={setOpen}>
			<PopoverTrigger>
				<BubbleMenuButton
					tooltip="Link"
					action={() => setOpen(true)}
					isActive={false}
				>
					<LinkIcon className="w-4 h-4" />
					<span className="sr-only">Link</span>
				</BubbleMenuButton>
			</PopoverTrigger>
			<PopoverContent align="end">
				<div className="flex items-center gap-2">
					<Input
						ref={inputRef}
						placeholder="https://example.com"
						defaultValue={linkValue || ""}
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSubmit();
							}
						}}
					/>
					{linkValue ? (
						<Button
							onClick={() => {
								editor.chain().focus().unsetLink().run();
								if (inputRef.current) {
									inputRef.current.value = "";
								}
								setValue("");
								setOpen(false);
							}}
							size="icon"
						>
							<UnlinkIcon className="size-4" />
						</Button>
					) : (
						<Button onClick={handleSubmit} size="icon">
							<LinkIcon className="size-4" />
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default LinkSelector;
