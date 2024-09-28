import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

export const VariableExtension = Extension.create({
  name: 'variableHighlight',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('variableHighlight'),
        props: {
          decorations(state) {
            const decorations: Decoration[] = []
            const doc = state.doc

            doc.descendants((node, pos) => {
              if (node.isText) {
                const text = node.text || ''
                const regex = /\{\{([^|}]+)(?:\|([^}]+))?\}\}/g
                let match
                while ((match = regex.exec(text)) !== null) {
                  const start = pos + match.index
                  const end = start + match[0].length
                  decorations.push(
                    Decoration.inline(start, end, {
                      class: 'variable',
                    })
                  )
                }
              }
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})