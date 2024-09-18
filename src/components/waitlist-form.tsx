"use client"

import { useState } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { addToWaitlistAction } from '@/actions/waitlist-actions'

export function WaitlistForm() {
  const [email, setEmail] = useState('')

  const { execute, status } = useAction(addToWaitlistAction, {
    onSuccess: () => {
      toast({ title: 'You\'re on the waitlist!', description: 'We will notify you when we launch.' })
      setEmail('')
    },
    onError: () =>
      toast({
        title: 'Sorry, we couldn\'t add you to the waitlist',
        description: 'If you have already signed up, you are already on the waitlist.',
        variant: 'destructive',
      }),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    execute({ email })
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center max-w-md w-full">
      <div className="relative w-full">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 px-4 py-3 pr-24 border border-border rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
          required
        />
        <Button
          type="submit"
          className="absolute right-1 top-1 px-4 py-2 bg-black text-white bg-gradient-to-r from-green-400 to-green-500 font-semibold rounded hover:bg-gray-800 transition-colors"
          disabled={status === 'executing'}
        >
          {status === 'executing' ? 'Joining...' : 'Join waitlist'}
        </Button>
      </div>
    </form>
  )
}
