'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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
import Editor from './editor/editor'
import { sendPreviewBroadcastMutation } from '@/lib/supabase/mutations/broadcasts'
import { SubmitButton } from './ui/submit-button'
import { Database } from '@/types/supabase'

type Email = Database['public']['Tables']['emails']['Row']

interface Broadcast {
  id: Email['id'] | null
  subject: Email['subject']
  content: Email['content']
  preview: Email['preview']
}

interface BroadcastEditorProps {
  initialBroadcast?: Email
}

export function BroadcastEditor({ initialBroadcast }: BroadcastEditorProps) {
  const [broadcast, setBroadcast] = useState<Broadcast>(
    initialBroadcast || { id: null, subject: '', content: '', preview: null }
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>(initialBroadcast ? 'saved' : 'idle')
  const [testEmail, setTestEmail] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const debouncedSave = useDebouncedCallback(async (updatedBroadcast: Broadcast) => {
    if (updatedBroadcast.subject.trim() && updatedBroadcast.content.trim()) {
      try {
        setSavingStatus('saving')
        const result = await createUpdateEmailAction(updatedBroadcast)

        console.log('result', result)
        const newId = result?.data.id ?? null
        setBroadcast(prev => ({ ...prev, id: newId }))

        // Update URL if it's a new broadcast and we got an ID
        if (newId && pathname === '/dashboard/broadcasts/new') {
          router.push(`/dashboard/broadcasts/${newId}`)
        }

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

  function handleChange<T extends keyof Broadcast>(field: T) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const updatedBroadcast = { ...broadcast, [field]: e.target.value }
      setBroadcast(updatedBroadcast)
      debouncedSave(updatedBroadcast)
    }
  }


  async function handleSend(selectedContacts: string[]) {
    if (!broadcast.id) {
      toast({
        title: 'Error',
        description: 'Please wait for the email to be saved before sending.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSendingEmail(true)
      const result = await sendBroadcastAction({
        emailId: broadcast.id,
        contactIds: selectedContacts // Convert numbers to strings
      })
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
    setIsSendingEmail(false)
  }

  async function handleSendTestEmail(email: string) {
    if (!broadcast.id) {
      toast({
        title: 'Error',
        description: 'Please wait for the email to be saved before sending.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSendingEmail(true)
      const result = await sendPreviewBroadcastMutation({ emailId: broadcast.id, emailAddress: email })
      if (result?.success) {
        toast({
          title: 'Test email sent',
          description: 'Your test email has been sent successfully.',
        })
        // setIsPreviewOpen(false)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send test email',
        variant: 'destructive',
      })
    }
    setIsSendingEmail(false)
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Subject"
        value={broadcast.subject}
        onChange={handleChange('subject')}
        className=""
      />
      <Textarea
        placeholder="Preview"
        value={broadcast.preview || ''}
        onChange={handleChange('preview')}
        className="min-h-[100px]"
      />
      <Editor
        className='min-h-[420px]'
        defaultValue={broadcast.content}
        onUpdate={(editor) => {
          const html = editor?.getHTML() || '';
          const updatedBroadcast = { ...broadcast, content: html };
          setBroadcast(updatedBroadcast);
          debouncedSave(updatedBroadcast);
        }}
        uploadOptions={{
          path: `${broadcast.id}`
        }}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!broadcast.subject || !broadcast.content}>Send Broadcast</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Contacts</DialogTitle>
              </DialogHeader>
              <ContactSelector onSend={handleSend} isSendingEmail={isSendingEmail} />
            </DialogContent>
          </Dialog>

          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={!broadcast.subject || !broadcast.content}>Send test email</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send test email</DialogTitle>
              </DialogHeader>
              <Input placeholder="Email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
              <SubmitButton isSubmitting={isSendingEmail} onClick={() => handleSendTestEmail(testEmail)}>Send</SubmitButton>
            </DialogContent>
          </Dialog>
        </div>

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
