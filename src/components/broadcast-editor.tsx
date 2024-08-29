'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createUpdateEmailAction } from '@/actions/create-update-broadcast-action'
import { sendBroadcastAction } from '@/actions/send-broadcast-action'
import { toast } from '@/components/ui/use-toast'
import { useDebouncedCallback } from 'use-debounce'
import { cn } from '@/lib/utils'
import { ContactSelector } from '@/components/contacts-selector'

interface Broadcast {
  id: number | null
  subject: string
  content: string
}

interface BroadcastEditorProps {
  initialBroadcast?: Broadcast
}

export function BroadcastEditor({ initialBroadcast }: BroadcastEditorProps) {
  const [broadcast, setBroadcast] = useState<Broadcast>(
    initialBroadcast || { id: null, subject: '', content: '' }
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>(initialBroadcast ? 'saved' : 'idle')
  const router = useRouter()

  const debouncedSave = useDebouncedCallback(async (updatedBroadcast: Broadcast) => {
    if (updatedBroadcast.subject.trim() && updatedBroadcast.content.trim()) {
      try {
        setSavingStatus('saving')
        const result = await createUpdateEmailAction(updatedBroadcast)
        setBroadcast(prev => ({ ...prev, id: result?.data.id ?? null }))

        setTimeout(() => setSavingStatus('saved'), 1000)
      } catch (error) {
        console.error('Failed to save draft:', error)
        setSavingStatus('idle')
        toast({
          title: 'Error',
          description: 'Failed to save draft',
          variant: 'destructive',
        })
      }
    } else {
      setSavingStatus('idle')
    }
  }, 1000)

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedBroadcast = { ...broadcast, subject: e.target.value }
    setBroadcast(updatedBroadcast)
    debouncedSave(updatedBroadcast)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedBroadcast = { ...broadcast, content: e.target.value }
    setBroadcast(updatedBroadcast)
    debouncedSave(updatedBroadcast)
  }

  async function handleSend(selectedContacts: number[]) {
    if (!broadcast.id) {
      toast({
        title: 'Error',
        description: 'Please wait for the email to be saved before sending.',
        variant: 'destructive',
      })
      return
    }

    try {
      const result = await sendBroadcastAction({ emailId: broadcast.id, contactIds: selectedContacts })
      if (result?.data?.success) {
        toast({
          title: 'Broadcast sent',
          description: 'Your broadcast has been sent successfully.',
        })
        router.push('/dashboard/broadcasts')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send broadcast',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="">
      <Input
        placeholder="Subject"
        value={broadcast.subject}
        onChange={handleSubjectChange}
        className="mb-4"
      />
      <Textarea
        placeholder="Content"
        value={broadcast.content}
        onChange={handleContentChange}
        className="mb-4"
        rows={10}
      />
      <div className="flex items-center justify-between">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!broadcast.subject || !broadcast.content}>Send Broadcast</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Contacts</DialogTitle>
            </DialogHeader>
            <ContactSelector onSend={handleSend} />
          </DialogContent>
        </Dialog>
        <div className="flex items-center space-x-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-700",
              savingStatus === 'saving' && "bg-green-500 animate-[pulse_2s_ease-in-out_infinite]",
              savingStatus === 'saved' && "bg-green-500",
              savingStatus === 'idle' && "bg-gray-300"
            )}
          />
          <span className="text-sm text-muted-foreground">
            {savingStatus === 'saving' && 'Saving'}
            {savingStatus === 'saved' && 'Saved'}
            {savingStatus === 'idle' && 'Not saved'}
          </span>
        </div>
      </div>
    </div>
  )
}
