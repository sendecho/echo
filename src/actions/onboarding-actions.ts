"use server"

import { actionClient } from "@/lib/safe-action"
import { emailSetupSchema, domainVerificationSchema, mailingAddressSchema } from '@/lib/schemas/onboarding-schema'
import { createClient } from '@/lib/supabase/server'
import { Resend } from "resend"

export const emailSetupAction = actionClient
  .schema(emailSetupSchema)
  .action(async ({ parsedInput: { fromName, domain } }) => {

    const supabase = createClient()

    const { error } = await supabase
      .from('accounts')
      .upsert({ from_name: fromName, domain: domain })

    if (error) throw new Error('Failed to save email setup data')

    // Create a domain in Resend
    const resend = new Resend(process.env.RESEND_API_KEY)
    const resendDomain = await resend.domains.create({ name: domain })

    console.log('resendDomain', resendDomain)

    // If there was an error creating the domain, throw an error
    if (resendDomain.error) throw new Error('Failed to create domain in Resend')

    // Return the domain details in the response
    return { success: true, resendDomain }
  })

export const domainVerificationAction = actionClient
  .schema(domainVerificationSchema)
  .action(async ({ parsedInput: { domainVerified } }) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('user_profiles')
      .upsert({ domain_verified: domainVerified })

    if (error) throw new Error('Failed to save domain verification data')
    return { success: true }
  })

export const mailingAddressAction = actionClient
  .schema(mailingAddressSchema)
  .action(async ({ parsedInput: mailingAddress }) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('user_profiles')
      .upsert({ mailing_address: mailingAddress })

    if (error) throw new Error('Failed to save mailing address data')
    return { success: true }
  })