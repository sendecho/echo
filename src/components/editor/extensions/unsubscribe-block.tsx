import { Node, mergeAttributes } from "@tiptap/core";
import { Node as ProseMirrorNode } from "prosemirror-model";

export const UnsubscribeBlock = Node.create({
	name: "unsubscribeBlock",
	group: "block",
	content: "horizontalRule paragraph{2}",

	parseHTML() {
		return [
			{
				tag: 'div[data-type="unsubscribe"]',
			},
		];
	},

	addAttributes() {
		return {
			"data-type": {
				default: "unsubscribe",
			},
		};
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(HTMLAttributes, {
				class: "text-sm text-muted-foreground mt-8",
			}),
			0,
		];
	},

	addKeyboardShortcuts() {
		return {
			// Delete the node if user presses backspace at the start of an empty paragraph
			Backspace: () => {
				const { empty, $anchor } = this.editor.state.selection;
				const isAtStart = $anchor.pos === $anchor.start();

				if (!empty || !isAtStart) {
					return false;
				}

				// Check if both paragraphs are empty (only contain hard breaks or are completely empty)
				const node = $anchor.node(-1);
				if (!node || node.type.name !== this.name) {
					return false;
				}

				// Get all paragraph nodes
				const paragraphs: ProseMirrorNode[] = [];
				node.descendants((node: ProseMirrorNode) => {
					if (node.type.name === "paragraph") {
						paragraphs.push(node);
					}
					return true;
				});

				// Check if paragraphs are empty or only contain hard breaks
				const isEmpty = paragraphs.every(
					(node) =>
						node.content.size === 0 ||
						(node.content.size === 1 &&
							node.firstChild?.type.name === "hardBreak"),
				);

				if (isEmpty) {
					this.editor.commands.deleteNode(this.name);
					return true;
				}

				return false;
			},
		};
	},
});
