'use server'

import { z } from 'zod'
import { authSafeAction } from "@/lib/safe-action"
import { updateAccountSettingsMutation } from '@/lib/supabase/mutations/account-settings'
import { updateAccountSettingsSchema, type UpdateAccountSettings } from '@/lib/schemas/account-settings-schema'

export const updateAccountSettingsAction = authSafeAction
  .schema(updateAccountSettingsSchema)
  .metadata({
    name: 'update-account-settings',
  })
  .action(async ({ parsedInput: { ...data }, ctx: { user } }) => {
    try {
      console.log(data, user)
      const result = await updateAccountSettingsMutation({ ...data, account_id: user.account_id as string })
      return result
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('An unexpected error occurred')
    }
  })