"use server"

import { z } from 'zod'
import { actionClient } from "@/lib/safe-action"
import { createClient } from '@/lib/supabase/server'

const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const addToWaitlistAction = actionClient
  .schema(waitlistSchema)
  .action(async ({ parsedInput: { email } }) => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('waitlist')
      .insert({ email })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        throw new Error('This email is already on the waitlist.')
      }
      throw new Error('Failed to add to waitlist. Please try again.')
    }

    return data
  })
