import React from 'react';
import { Editor } from '@tiptap/core';
import { Bold, Italic, Code, Highlighter } from 'lucide-react';

interface FormatButtonProps {
  editor: Editor;
  format: 'bold' | 'italic' | 'code' | 'highlight';
}

const FormatButton: React.FC<FormatButtonProps> = ({ editor, format }) => {
  const isActive = editor.isActive(format);

  const handleClick = () => {
    editor.chain().focus()[format].toggle().run();
  };

  const getIcon = () => {
    switch (format) {
      case 'bold':
        return <Bold className="w-5 h-5" />;
      case 'italic':
        return <Italic className="w-5 h-5" />;
      case 'code':
        return <Code className="w-5 h-5" />;
      case 'highlight':
        return <Highlighter className="w-5 h-5" />;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-md ${isActive ? 'text-blue-500 bg-blue-100' : 'text-gray-600 hover:bg-gray-100'
        }`}
      title={`Toggle ${format}`}
    >
      {getIcon()}
    </button>
  );
};

export const BoldButton: React.FC<{ editor: Editor }> = ({ editor }) => (
  <FormatButton editor={editor} format="bold" />
);

export const ItalicButton: React.FC<{ editor: Editor }> = ({ editor }) => (
  <FormatButton editor={editor} format="italic" />
);

export const CodeButton: React.FC<{ editor: Editor }> = ({ editor }) => (
  <FormatButton editor={editor} format="code" />
);

export const HighlightButton: React.FC<{ editor: Editor }> = ({ editor }) => (
  <FormatButton editor={editor} format="highlight" />
);