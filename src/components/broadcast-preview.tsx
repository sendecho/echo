import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface BroadcastPreviewProps {
  subject: string
  content: string
}

export function BroadcastPreview({ subject, content }: BroadcastPreviewProps) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Input
        value={subject}
        className="mb-4"
        readOnly
      />
      <Textarea
        value={content}
        className="mb-4"
        rows={10}
        readOnly
      />
    </div>
  )
}
