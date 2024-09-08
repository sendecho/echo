'use server'

import { z } from 'zod'
import { authSafeAction } from "@/lib/safe-action"
import { createOrUpdateEmailMutation } from '@/lib/supabase/mutations/broadcasts'

const schema = z.object({
  id: z.string().nullable(),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  preview: z.string().min(2).max(80, 'Preview must be 80 characters or less').optional().nullish(),
})

export const createUpdateEmailAction = authSafeAction
  .schema(schema)
  .metadata({ name: 'create-update-broadcast-action' })
  .action(
    async ({ parsedInput: { id, subject, content, preview }, ctx: { user } }) => {
      try {
        const result = await createOrUpdateEmailMutation({ id, subject, content, preview: preview || null, account_id: user.account_id as string })
        return result
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message)
        }
        throw new Error('An unexpected error occurred')
      }
    }
  )
