import { z } from 'zod'

export const updateAccountSettingsSchema = z.object({
  name: z.string().min(2).max(32).optional(),
  domain: z.string().min(2).optional(),
  domain_verified: z.boolean().optional(),
  from_name: z.string().min(2).optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  created_at: z.date().optional()
})

export type UpdateAccountSettings = z.infer<typeof updateAccountSettingsSchema>
