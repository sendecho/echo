import { Editor, Range, Extension } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import tippy from 'tippy.js'
import editor from '../editor'
import { CodeIcon, Heading1Icon, Heading2Icon, Heading3Icon, ImageIcon, ListIcon, ListOrderedIcon, TextIcon } from 'lucide-react'


interface CommandProps {
  editor: Editor
  range: Range
}

interface CommandItemProps {
  title: string
  description: string
  icon: React.ReactNode
  command: (props: CommandProps) => void
}

export const Command = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }) => {
          props.command({ editor, range })
        },
      } as SuggestionOptions,
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: "Text",
      description: "Add text to the document",
      icon: <TextIcon size={16} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run()
      }
    },
    {
      title: 'Heading 1',
      description: 'Add a heading 1 to the document',
      icon: <Heading1Icon size={16} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
      }
    },
    {
      title: "Heading 2",
      description: "Add a heading 2 to the document",
      icon: <Heading2Icon size={16} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
      }
    },
    {
      title: "Heading 3",
      description: "Add a heading 3 to the document",
      icon: <Heading3Icon size={16} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
      }
    },
    {
      title: "Bullet List",
      description: "Add a bullet list to the document",
      icon: <ListIcon size={16} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run()
      }
    },
    {
      title: "Numbered List",
      description: "Add a numbered list to the document",
      icon: <ListOrderedIcon size={16} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run()
      }
    },
    {
      title: "Code Block",
      description: "Add a code block to the document",
      icon: <CodeIcon size={16} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
      }
    },
    {
      title: "Image",
      description: "Upload an image from your computer.",
      searchTerms: ["photo", "picture", "media"],
      icon: <ImageIcon size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();
        // upload image
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
          if (input.files?.length) {
            const file = input.files[0];
            const pos = editor.view.state.selection.from;
            console.log(file, pos)
          }
        };
        input.click();
      },
    }


  ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
}


const CommandList = ({ items, command }: { items: CommandItemProps[], command: any }) => {

  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = useCallback((index: number) => {
    const item = items[index]
    if (item) {
      command(item)
    }
  }, [command, items])

  useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  const commandListContainer = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = commandListContainer.current

    const item = container?.children[selectedIndex] as HTMLElement
    if (item) {
      item.focus()
    }
  }, [selectedIndex])

  return (
    <div className="bg-white rounded-md shadow-md z-50 h-auto w-36 overflow-y-auto max-h-[300px] border border-border py-2 px-1 transition-all duration-100">
      {items.map((item: CommandItemProps, index: number) => (
        <button key={index} className="w-full p-2 hover:bg-gray-100 text-left text-sm" onClick={() => selectItem(index)}>
          <div className="flex items-center gap-2">
            {item.icon}
            <div className="text-sm font-medium">{item.title}</div>
          </div>
          <p className="text-xs text-gray-500">{item.description}</p>
        </button>
      ))}
    </div>
  )
}

const renderSuggestionItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: { editor: Editor, clientRect: DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      })

      const { selection } = props.editor.state;

      const parentNode = selection.$from.node(selection.$from.depth);
      const blockType = parentNode.type.name;

      // If the user is typing in a code block, don't show the suggestion
      if (blockType === 'code_block') {
        return
      }

      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        placement: 'bottom-start',
        trigger: 'manual',
      })
    },
    onUpdate: (props: { editor: Editor, clientRect: DOMRect }) => {
      component?.updateProps(props)

      popup && popup[0].setProps({
        getReferenceClientRect: props.clientRect,
      })
    },
    onKeyDown: (props: { editor: Editor, event: KeyboardEvent }) => {
      if (props.event.key === 'Escape') {
        popup?.[0]?.hide()

        return true
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props)
    },
    onExit: () => {
      popup?.[0]?.destroy()
      component?.destroy()
    },
  }
}

const SlashCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderSuggestionItems
  }
})

export default SlashCommand
