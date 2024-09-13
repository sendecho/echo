import { z } from 'zod'

export const emailSetupSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  fromName: z.string().min(1, 'From name is required'),
  domain: z.string().min(1, 'Domain is required'),
})

export const domainVerificationSchema = z.object({
  domainVerified: z.boolean(),
})

export const mailingAddressSchema = z.object({
  street_address: z.string().min(1, 'Street Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal Code is required'),
  country: z.string().min(1, 'Country is required'),
})

export type EmailSetupData = z.infer<typeof emailSetupSchema>
export type DomainVerificationData = z.infer<typeof domainVerificationSchema>
export type MailingAddressData = z.infer<typeof mailingAddressSchema>
