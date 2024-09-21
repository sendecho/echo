'use server'

import { z } from 'zod'
import { authSafeAction } from '@/lib/safe-action'
import { upsertContactsMutation } from '@/lib/supabase/mutations/contacts'

const schema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone_number: z.string().optional(),
  lists: z.array(z.string()).optional(),
})

export const addContact = authSafeAction.schema(schema).metadata({
  name: 'add-contact'
}).action(
  async ({ parsedInput: data, ctx: { user } }) => {
    if (!user.account_id) throw new Error('User account not found')

    const contact = {
      ...data,
      account_id: user.account_id,
      source: 'dashboard'
    }

    const result = await upsertContactsMutation([contact])
    return { success: true, contact: result[0] }
  })