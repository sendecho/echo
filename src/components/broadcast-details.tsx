'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BroadcastEditor } from '@/components/broadcast-editor'
// import { BroadcastAnalytics } from '@/components/broadcast-analytics'
import { BroadcastPreview } from '@/components/broadcast-preview'

interface Broadcast {
  id: string
  subject: string
  content: string
  sent_at: string | null
  account_id: string | null
  created_at: string | null
  from_email: string | null
  from_name: string | null
  preview: string | null
  // Add other relevant fields
}

export function BroadcastDetails({ broadcast }: { broadcast: Broadcast }) {
  const [activeTab, setActiveTab] = useState(broadcast.sent_at ? 'analytics' : 'edit')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className='mb-4'>
        {broadcast.sent_at ? (
          <>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </>
        ) : (
          <>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </>
        )}
      </TabsList>
      <TabsContent value="analytics">
        {/* <BroadcastAnalytics broadcastId={broadcast.id} /> */}
      </TabsContent>
      <TabsContent value="edit">
        <BroadcastEditor initialBroadcast={broadcast} />
      </TabsContent>
      <TabsContent value="preview">
        <BroadcastPreview subject={broadcast.subject} content={broadcast.content} />
      </TabsContent>
    </Tabs>
  )
}