import { BubbleMenu as TiptapBubbleMenu, BubbleMenuProps as TiptapBubbleMenuProps, isNodeSelection } from "@tiptap/react";
import { BoldIcon, ItalicIcon, HighlighterIcon, CodeIcon } from 'lucide-react'
import NodeSelector from "./node-selector";
import { cn } from "@/lib/utils";

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: typeof BoldIcon;
}

type BubbleMenuProps = Omit<TiptapBubbleMenuProps, "children">

export const BubbleMenu = (props: BubbleMenuProps) => {

  const items: BubbleMenuItem[] = [
    {
      name: "bold",
      isActive: () => props.editor!.isActive("bold"),
      command: () => props.editor!.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: () => props.editor!.isActive("italic"),
      command: () => props.editor!.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "highlight",
      isActive: () => props.editor!.isActive("highlight"),
      command: () => props.editor!.chain().focus().toggleHighlight().run(),
      icon: HighlighterIcon,
    },
    {
      name: "code",
      isActive: () => props.editor!.isActive("code"),
      command: () => props.editor!.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ];

  const bubbleMenuProps: BubbleMenuProps = {
    ...props,
    shouldShow: ({ state, editor }) => {

      const { selection } = state
      const { empty } = selection

      // if editor is not editable, don't show the bubble menu
      // if selection is empty, don't show the bubble menu
      // if selection is a node selection, don't show the bubble menu
      if (!editor.isEditable || empty || isNodeSelection(selection)) {
        return false
      }

      return true
    },
  };

  return (
    <TiptapBubbleMenu {...bubbleMenuProps} className="flex w-fit divide-x rounded border bg-background shadow-xl">
      <NodeSelector editor={props.editor!} />
      <div className="flex">
        {items.map((item) => (
          <button key={item.name} onClick={item.command} className="p-2 text-muted-foreground hover:bg-muted/50 rounded-md">
            <item.icon className={cn("w-4 h-4", item.isActive() ? "text-primary" : "text-muted-foreground")} />
          </button>
        ))}
      </div>
    </TiptapBubbleMenu>
  );
};

export default BubbleMenu;