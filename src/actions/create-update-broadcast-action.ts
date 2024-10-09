'use server'

import { z } from 'zod'
import { authSafeAction } from "@/lib/safe-action"
import { createEmail, updateEmailMutation } from '@/lib/supabase/mutations/broadcasts'
import { updateBroadcastSchema } from '@/lib/schemas/broadcast-schema'

export const createEmailAction = authSafeAction
  .schema(z.object({}))
  .metadata({ name: 'create-email-action' })
  .action(
    async ({ ctx: { user } }) => {
      try {
        const result = await createEmail({ account_id: user.account_id as string, from_name: user.account?.from_name || user?.full_name || '', from_email: `no-reply@${user.account?.domain || ''}` })
        return result
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message)
        }
        throw new Error('An unexpected error occurred')
      }
    }
  )


export const updateEmailAction = authSafeAction
  .schema(updateBroadcastSchema)
  .metadata({ name: 'create-update-broadcast-action' })
  .action(
    async ({ parsedInput: { id, subject, content, preview, from_name, from_email } }) => {
      try {

        const result = await updateEmailMutation({ id, subject, content, preview: preview || null, from_name: from_name || null, from_email: from_email || null })
        return result
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message)
        }
        throw new Error('An unexpected error occurred')
      }
    }
  )
