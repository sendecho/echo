'use server'

import { z } from 'zod'
import { actionClient, authSafeAction } from "@/lib/safe-action"
import { sendBroadcastMutation } from '@/lib/supabase/mutations/broadcasts'
import { revalidatePath } from 'next/cache'
import { tasks } from '@trigger.dev/sdk/v3'
import { sendBroadcastTask } from '@/trigger/send-broadcast'

const schema = z.object({
  emailId: z.string(),
  listIds: z.array(z.string()).optional(),
  contactIds: z.array(z.string()).optional(),
})

export const sendBroadcastAction = authSafeAction
  .schema(schema)
  .metadata({
    name: 'send-broadcast',
  })
  .action(
    async ({ parsedInput: { emailId, listIds, contactIds } }) => {
      try {
        // const result = await sendBroadcastMutation({ emailId, listIds, contactIds })

        const event = await tasks.triggerAndPoll<typeof sendBroadcastTask>(
          'send-broadcast',
          {
            emailId,
            listIds,
            contactIds,
          }
        );

        revalidatePath('/dashboard/broadcasts')
        return { event }
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message)
        }
        throw new Error('An unexpected error occurred')
      }
    }
  )
