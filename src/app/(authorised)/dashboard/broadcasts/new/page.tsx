import { BroadcastEditor } from '@/components/broadcast-editor'
import DashboardLayout from '@/components/layouts/dashboard-layout'

export default function NewBroadcast() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Create New Broadcast</h1>
      <BroadcastEditor />
    </DashboardLayout>
  )
}