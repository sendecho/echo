'use server'

import { z } from 'zod'
import { parse } from 'csv-parse/sync'
import { authSafeAction } from '@/lib/safe-action'
import { upsertContactsMutation } from '@/lib/supabase/mutations/contacts'

const schema = z.object({
  fileContent: z.string(),
})

export const importContacts = authSafeAction.schema(schema).metadata({
  name: 'import-contacts'
}).action(
  async ({ parsedInput: { fileContent }, ctx: { user } }) => {
    if (!user.account_id) throw new Error('User account not found')

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    })

    const contacts = records.map((record: any) => ({
      first_name: record.first_name,
      last_name: record.last_name,
      email: record.email,
      phone_number: record.phone_number,
      account_id: user.account_id,
      source: 'import',
      lists: record.lists ? record.lists.split(',').map((list: string) => list.trim()) : []
    }))

    const result = await upsertContactsMutation(contacts)
    return { success: true, count: result.length }
  })