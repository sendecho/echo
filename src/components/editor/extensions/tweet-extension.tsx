import { Node, mergeAttributes, nodePasteRule } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { Tweet } from 'react-tweet'

const TweetComponent = ({ node }: { node: any }) => {
  const url = node.attrs.src
  const tweetIdRegex = /\/status\/(\d+)/g
  const id = tweetIdRegex.exec(url)?.[1]

  return (
    <NodeViewWrapper className='twitter-tweet'>
      <Tweet id={id || ''} />
    </NodeViewWrapper>
  )
}

export const TweetExtension = Node.create({
  name: 'tweet',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-tweet]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-tweet': '' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TweetComponent)
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: /https?:\/\/(twitter\.com|x\.com)\/\w+\/status\/(\d+)/g,
        type: this.type,
        getAttributes: (match) => {
          return { src: match.input }
        },
      }),
    ]
  },
})