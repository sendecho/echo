"use client";

import { EditorContent, Extension, JSONContent, useEditor, Editor as EditorClass } from "@tiptap/react";
import { defaultExtensions } from "./extensions";
import BubbleMenu from "./bubble-menu";
import "./prosemirror.css";
import { useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Toolbar from "./toolbar";
import { cn } from "@/lib/utils";
import { uploadFn } from "./image-upload";
import { handleImagePaste, handleImageDrop } from "./plugins/upload-images";
import { UploadOptions } from "./image-upload";

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
  uploadOptions?: UploadOptions;
}

export default function Editor({
  className,
  onUpdate = () => { },
  extensions = [],
  defaultValue,
  onDebouncedUpdate = () => { },
  debounceDuration = 500,
  uploadOptions
}: EditorProps) {
  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    onDebouncedUpdate(editor);
  }, debounceDuration);

  const upload = useMemo(() => uploadOptions ? uploadFn(uploadOptions) : undefined, [uploadOptions]);

  const editor = useEditor({
    extensions: [...defaultExtensions, ...extensions],
    content: defaultValue,
    editable: true,
    onUpdate: ({ editor }) => {
      onUpdate(editor);
      debouncedUpdates({ editor });
    },
    editorProps: {
      handlePaste: (view, event) => upload ? handleImagePaste(view, event, upload) : undefined,
      handleDrop: (view, event, _slice, moved) =>
        upload ? handleImageDrop(view, event, moved, upload) : undefined,
      attributes: {
        class: `prose prose-sm sm:prose-base dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
      },
    }
  })

  return (
    <div className={cn("relative w-full rounded-md", className)}>
      {editor && <Toolbar editor={editor} />}
      {editor && <BubbleMenu editor={editor} />}
      <EditorContent editor={editor} spellCheck="false" />
    </div>
  )
}