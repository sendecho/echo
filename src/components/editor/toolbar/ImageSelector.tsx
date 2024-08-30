import React, { useRef } from 'react';
import { Editor } from '@tiptap/core';
import { Image } from 'lucide-react';

const ImageSelector = ({ editor }: { editor: Editor }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        editor.chain().focus().setImage({ src: imageDataUrl }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <button
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
      />
    </div>
  );
};

export default ImageSelector;