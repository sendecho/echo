import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";
import Typography from "@tiptap/extension-typography";
import Paragraph from "@tiptap/extension-paragraph";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TiptapImage from "@tiptap/extension-image";
import Dropcursor from '@tiptap/extension-dropcursor'
import GapCursor from '@tiptap/extension-gapcursor'
import Youtube from '@tiptap/extension-youtube'
import SlashCommand from './extensions/slash-command'
import { UploadImagesPlugin } from './plugins/upload-images'
import { TweetExtension } from './extensions/tweet-extension'

import { cx } from "class-variance-authority";

export const defaultExtensions = [
  // Nodes
  Text,
  Document,
  Placeholder.configure({
    placeholder: "Write here...",
  }),
  Typography,
  Paragraph,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: cx("text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"),
    },
  }),
  BulletList,
  OrderedList,
  CodeBlock,
  Heading,
  ListItem,
  TiptapImage.extend({
    addProseMirrorPlugins() {
      return [
        UploadImagesPlugin({
          imageClass: "rounded-lg border border-border",
        })
      ]
    },
  }).configure({
    inline: true,
    allowBase64: true,
    HTMLAttributes: {
      class: "rounded-lg border border-border",
    },
  }),
  Youtube,
  TweetExtension,

  // Formatting
  Bold,
  Italic,
  Highlight,
  Underline,
  Code,

  // Extensions
  SlashCommand,

  Dropcursor.configure({
    width: 3,
    color: "#BFE5F4",
    class: "drop-cursor"
  }),
  GapCursor,

]