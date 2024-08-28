import { BroadcastEditor } from '@/components/broadcast-editor'

export default function NewBroadcast() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Create New Broadcast</h1>
      <BroadcastEditor />
    </div>
  )
}