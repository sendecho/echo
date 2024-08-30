import React from 'react';
import { Editor } from '@tiptap/react';
import { PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/components/ui/popover';

const blockTypes = [
  {
    name: 'Paragraph',
    command: (editor: Editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    name: 'Heading 1',
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    name: 'Heading 2',
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    name: 'Bullet List',
    command: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    name: 'Numbered List',
    command: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    name: 'Code Block',
    command: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
];

interface BlockPickerProps {
  editor: Editor;
}

const BlockPicker: React.FC<BlockPickerProps> = ({ editor }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 p-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
          <PlusCircle className="w-4 h-4" />
          Add block
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1">
        {blockTypes.map((block) => (
          <button
            key={block.name}
            onClick={() => block.command(editor)}
            className="flex items-center w-full px-2 py-1 text-sm text-left text-gray-900 hover:bg-gray-100 rounded-md"
          >
            {block.name}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default BlockPicker;