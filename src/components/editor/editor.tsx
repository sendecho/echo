"use client";

import { EditorContent, Extension, JSONContent, useEditor, Editor as EditorClass } from "@tiptap/react";
import { defaultExtensions } from "./extensions";
import BubbleMenu from "./bubble-menu";
import "./prosemirror.css";
import { useUpload } from "@/lib/hooks/use-upload";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Toolbar from "./toolbar";
import { cn } from "@/lib/utils";


interface EditorProps {
  className?: string;

  defaultValue?: JSONContent | string;

  /**
   * Extensions to use, in addition to the default ones
   * defaults to defaultExtensions
   */
  extensions?: Extension[];
  /**
   * Called when the update is updated
   */
  onUpdate?: (editor?: EditorClass) => void;
  /**
   * Called when the update is debounced
   */
  onDebouncedUpdate?: (editor?: EditorClass) => void;
  debounceDuration?: number;
}


export default function Editor({
  className,
  onUpdate = () => { },
  extensions = [],
  defaultValue,
  onDebouncedUpdate = () => { },
  debounceDuration = 500
}: EditorProps) {
  const { upload } = useUpload();
  const [isUploading, setIsUploading] = useState(false);

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    onDebouncedUpdate(editor);
  }, debounceDuration);

  const editor = useEditor({
    extensions: [...defaultExtensions, ...extensions],
    content: defaultValue,
    editable: true,
    onUpdate: ({ editor }) => {
      onUpdate(editor);
      debouncedUpdates({ editor });
    },
    editorProps: {
      // TODO: fix this
      handleDrop: async (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            setIsUploading(true);
            try {
              const { publicUrl } = await upload({ file, bucket: 'images', path: 'editor' });
              const { schema } = view.state;
              const node = schema.nodes.image.create({ src: publicUrl });
              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
            } catch (error) {
              console.error('Error uploading image:', error);
            } finally {
              setIsUploading(false);
            }
            return true;
          }
        }
        return false;
      },
      attributes: {
        class: `prose prose-sm sm:prose-base dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
      },
    }
  })



  return (
    <div className={cn("relative w-full border border-border rounded-md p-2", className)}>
      {editor && <Toolbar editor={editor} />}
      {editor && <BubbleMenu editor={editor} />}
      <EditorContent editor={editor} spellCheck="false" />
    </div>
  )
}