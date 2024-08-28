'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BroadcastEditor } from '@/components/broadcast-editor'
// import { BroadcastAnalytics } from '@/components/broadcast-analytics'
import { BroadcastPreview } from '@/components/broadcast-preview'

interface Broadcast {
  id: number
  subject: string
  content: string
  sent_at: string | null
  // Add other relevant fields
}

export function BroadcastDetails({ broadcast }: { broadcast: Broadcast }) {
  const [activeTab, setActiveTab] = useState(broadcast.sent_at ? 'analytics' : 'edit')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        {broadcast.sent_at ? (
          <>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </>
        ) : (
          <TabsTrigger value="edit">Edit</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="analytics">
        {/* <BroadcastAnalytics broadcastId={broadcast.id} /> */}
      </TabsContent>
      <TabsContent value="preview">
        <BroadcastPreview subject={broadcast.subject} content={broadcast.content} />
      </TabsContent>
      <TabsContent value="edit">
        <BroadcastEditor initialBroadcast={broadcast} />
      </TabsContent>
    </Tabs>
  )
}