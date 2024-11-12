'use server'

import { z } from 'zod'
import { authSafeAction } from "@/lib/safe-action"
import { revalidatePath } from 'next/cache'
import { tasks } from '@trigger.dev/sdk/v3'
import type { sendBroadcastTask } from '@/trigger/send-broadcast'

const schema = z.object({
  emailId: z.string(),
  listIds: z.array(z.string()).optional(),
  contactIds: z.array(z.string()).optional(),
  sendAt: z.date().optional(),
})

export const sendBroadcastAction = authSafeAction
  .schema(schema)
  .metadata({
    name: 'send-broadcast',
  })
  .action(
    async ({ parsedInput: { emailId, listIds, contactIds, sendAt } }) => {
      try {
        const event = await tasks.trigger<typeof sendBroadcastTask>(
          'send-broadcast',
          {
            emailId,
            listIds,
            contactIds,
            sendAt,
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
