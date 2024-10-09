import { z } from 'zod'

export const updateBroadcastSchema = z.object({
  id: z.string(),
  subject: z.string().min(1, 'Subject is required').optional().nullish(),
  content: z.string().min(1, 'Content is required').optional().nullish(),
  preview: z.string().min(2).max(80, 'Preview must be 80 characters or less').optional().nullish(),
  from_name: z.string().optional().nullish(),
  from_email: z.string().optional().nullish(),
})

export type UpdateBroadcastType = z.infer<typeof updateBroadcastSchema>
