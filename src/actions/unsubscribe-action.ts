'use server'

import { z } from 'zod'
import { actionClientWithMetadata } from "@/lib/safe-action"
import { unsubscribeMutation } from '@/lib/supabase/mutations/unsubscribe'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  contactId: z.number(),
})

export const unsubscribeAction = actionClientWithMetadata
  .schema(schema)
  .metadata({ name: 'unsubscribe-action' })
  .action(
    async ({ parsedInput: { contactId } }) => {
      try {
        const result = await unsubscribeMutation(contactId)
        revalidatePath('/dashboard/contacts')
        return result
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message)
        }
        throw new Error('An unexpected error occurred')
      }
    }
  )
