'use server'

import { z } from 'zod'
import { actionClient, authSafeAction } from "@/lib/safe-action"
import { sendBroadcastMutation } from '@/lib/supabase/mutations/broadcasts'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  emailId: z.string(),
  contactIds: z.array(z.string()).min(1, 'At least one contact must be selected'),
})

export const sendBroadcastAction = authSafeAction
  .schema(schema)
  .metadata({
    name: 'send-broadcast',
  })
  .action(
    async ({ parsedInput: { emailId, contactIds } }) => {
      try {
        const result = await sendBroadcastMutation({ emailId, contactIds })
        revalidatePath('/dashboard/broadcasts')
        return result
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message)
        }
        throw new Error('An unexpected error occurred')
      }
    }
  )
