import { z } from 'zod'

export const accountDetailsSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  domain: z.string().min(1, 'Domain is required'),
})

export const domainVerificationSchema = z.object({
  domainVerified: z.boolean(),
})

export const userSchema = z.object({
  fromName: z.string().min(1, 'From name is required'),
})

export const mailingAddressSchema = z.object({
  street_address: z.string().min(1, 'Street Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal Code is required'),
  country: z.string().min(1, 'Country is required'),
})

export const personalDetailsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  avatar: z.any().optional(),
});

export type AccountDetailsData = z.infer<typeof accountDetailsSchema>
export type DomainVerificationData = z.infer<typeof domainVerificationSchema>
export type MailingAddressData = z.infer<typeof mailingAddressSchema>
export type UserData = z.infer<typeof userSchema>
export type PersonalDetailsSchema = z.infer<typeof personalDetailsSchema>;
