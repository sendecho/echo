import type { Editor } from "@tiptap/core";
import { MailX } from "lucide-react";
import ToolbarButton from "./toolbar-button";
import type { Node as ProseMirrorNode } from "prosemirror-model";
import { TextSelection } from "prosemirror-state";

interface UnsubscribeButtonProps {
	editor: Editor;
}

export function UnsubscribeButton({ editor }: UnsubscribeButtonProps) {
	const hasUnsubscribe = Boolean(
		editor.state.doc.descendants(
			(node: ProseMirrorNode) => node.type.name === "unsubscribeBlock",
		),
	);

	const addUnsubscribeBlock = () => {
		if (hasUnsubscribe) return;

		// Create a new paragraph at the end
		editor
			.chain()
			.focus()
			.command(({ tr, dispatch }) => {
				if (dispatch) {
					// Move to end of document
					const endPos = tr.doc.content.size;
					tr.setSelection(TextSelection.create(tr.doc, endPos));
					return true;
				}
				return false;
			})
			.insertContent({
				type: "paragraph",
			})
			.insertContent({
				type: "unsubscribeBlock",
				attrs: { "data-type": "unsubscribe" },
				content: [
					{
						type: "horizontalRule",
					},
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: "You are receiving this email because you opted in via our site.",
							},
							{ type: "hardBreak" },
							{ type: "hardBreak" },
							{
								type: "text",
								text: "Want to change how you receive these emails? ",
							},
							{
								type: "text",
								marks: [
									{
										type: "link",
										attrs: {
											href: "{{{unsubscribe}}}",
										},
									},
								],
								text: "You can unsubscribe from this list",
							},
							{ type: "text", text: "." },
						],
					},
					{
						type: "paragraph",
						content: [
							{ type: "text", text: "Company Name" },
							{ type: "hardBreak" },
							{ type: "text", text: "99 Street Address" },
							{ type: "hardBreak" },
							{ type: "text", text: "City, STATE 000-000" },
						],
					},
				],
			})
			.run();
	};

	return (
		<ToolbarButton
			onClick={addUnsubscribeBlock}
			tooltip="Add unsubscribe footer"
			disabled={hasUnsubscribe}
			isActive={hasUnsubscribe}
		>
			<MailX className="h-4 w-4" />
		</ToolbarButton>
	);
}
