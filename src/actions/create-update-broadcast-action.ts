'use server'

import { z } from 'zod'
import { actionClient, authSafeAction } from "@/lib/safe-action"
import { createOrUpdateEmailMutation } from '@/lib/supabase/mutations/broadcasts'

const schema = z.object({
  id: z.number().nullable(),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
})

export const createUpdateEmailAction = authSafeAction
  .schema(schema)
  .metadata({ name: 'create-update-broadcast-action' })
  .action(
    async ({ parsedInput: { id, subject, content } }) => {
      try {
        console.log(id, subject, content)
        const result = await createOrUpdateEmailMutation(id, subject, content)
        console.log(result)
        return result
      } catch (error) {
        console.log(error)
        if (error instanceof Error) {
          throw new Error(error.message)
        }
        throw new Error('An unexpected error occurred')
      }
    }
  )
