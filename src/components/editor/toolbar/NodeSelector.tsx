import React from 'react';
import { Editor } from '@tiptap/core';
import { ChevronDown } from 'lucide-react';

const nodeOptions = [
  { label: 'Paragraph', value: 'paragraph' },
  { label: 'Heading 1', value: 'heading', attrs: { level: 1 } },
  { label: 'Heading 2', value: 'heading', attrs: { level: 2 } },
  { label: 'Heading 3', value: 'heading', attrs: { level: 3 } },
  { label: 'Bullet List', value: 'bulletList' },
  { label: 'Numbered List', value: 'orderedList' },
];

const NodeSelector = ({ editor }: { editor: Editor }) => {
  const activeNode = nodeOptions.find(node =>
    node.value === 'heading'
      ? editor.isActive('heading', node.attrs)
      : editor.isActive(node.value)
  );

  const handleSelect = (option: typeof nodeOptions[0]) => {
    if (option.attrs) {
      editor.chain().focus().toggleNode(option.value, option.attrs).run();
    } else {
      editor.chain().focus().toggleNode(option.value, option.value).run();
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-1 p-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
        onClick={() => document.getElementById('node-selector')?.click()}
      >
        {activeNode?.label || 'Paragraph'}
        <ChevronDown className="w-4 h-4" />
      </button>
      <select
        id="node-selector"
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        value={activeNode?.value}
        onChange={(e) => {
          const selectedOption = nodeOptions.find(option => option.value === e.target.value);
          if (selectedOption) handleSelect(selectedOption);
        }}
      >
        {nodeOptions.map((option) => (
          <option key={option.value + (option.attrs?.level || '')} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NodeSelector;