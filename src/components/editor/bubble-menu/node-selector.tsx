import React from 'react';
import { Editor } from '@tiptap/react';
import { Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface NodeSelectorProps {
  editor: Editor;
}

const nodeTypes = [
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
    name: 'Heading 3',
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
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


const NodeSelector: React.FC<NodeSelectorProps> = ({ editor }) => {
  const [open, setOpen] = React.useState(false);

  const activeNode = React.useMemo(() => {
    if (editor.isActive('paragraph')) return 'Paragraph';
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
    if (editor.isActive('bulletList')) return 'Bullet List';
    if (editor.isActive('orderedList')) return 'Numbered List';
    if (editor.isActive('codeBlock')) return 'Code Block';
    return 'Paragraph';
  }, [editor.state]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 p-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
          {activeNode}
          <ChevronDown className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-1 w-40">
        <div className="py-1">
          {nodeTypes.map((node) => (
            <button
              key={node.name}
              onClick={() => {
                node.command(editor);
                setOpen(false);
              }}
              className="flex items-center justify-between w-full px-2 py-1 text-sm text-left text-gray-900 hover:bg-gray-100 rounded-md"
            >
              {node.name}
              {node.name === activeNode && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NodeSelector;