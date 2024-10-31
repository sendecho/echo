'use server'

import { z } from 'zod'
import { parse } from 'csv-parse/sync'
import { authSafeAction } from '@/lib/safe-action'
import { upsertContactsMutation } from '@/lib/supabase/mutations/contacts'
import { importContactCSVTask } from '@/trigger/import-contact'
import { tasks } from '@trigger.dev/sdk/v3'

const schema = z.object({
  fileContent: z.string(),
})

export const importContacts = authSafeAction.schema(schema).metadata({
  name: 'import-contacts'
}).action(
  async ({ parsedInput: { fileContent }, ctx: { user } }) => {
    if (!user.account_id) throw new Error('User account not found')

    try {
      const event = await tasks.trigger<typeof importContactCSVTask>(
        'import-contacts-csv',
        {
          fileContent,
          accountId: user.account_id
        }
      );

      return { event }
    } catch (error) {
      console.error(error);
    }
  })