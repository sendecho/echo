"use server"

import { actionClient, authSafeAction } from "@/lib/safe-action"
import { emailSetupSchema, domainVerificationSchema, mailingAddressSchema } from '@/lib/schemas/onboarding-schema'
import { createClient } from '@/lib/supabase/server'
import { Resend } from "resend"

export const emailSetupAction = authSafeAction
  .schema(emailSetupSchema)
  .metadata({
    name: 'email-setup',
  })
  .action(async ({ parsedInput: { fromName, domain }, ctx: { user } }) => {

    const supabase = createClient()

    const { data, error } = await supabase.rpc('create_account_and_link_user', {
      domain: domain,
      from_name: fromName,
      user_id: user.id,
    })

    if (error) throw new Error('Failed to create account and link user')

    console.log('data', data)

    // Create a domain in Resend
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // const resendDomain = await resend.domains.create({ name: domain })

    // console.log('resendDomain', resendDomain)

    // // If there was an error creating the domain, throw an error
    // if (resendDomain.error) throw new Error('Failed to create domain in Resend')

    // Return the domain details in the response
    return { success: true }
  })

export const domainVerificationAction = authSafeAction
  .schema(domainVerificationSchema)
  .metadata({
    name: 'domain-verification',
  })
  .action(async ({ parsedInput: { domainVerified } }) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('accounts')
      .upsert({ domain_verified: domainVerified })

    if (error) throw new Error('Failed to save domain verification data')
    return { success: true }
  })

export const mailingAddressAction = authSafeAction
  .schema(mailingAddressSchema)
  .metadata({
    name: 'mailing-address',
  })
  .action(async ({ parsedInput: { streetAddress, city, state, postalCode, country }, ctx: { user } }) => {
    const supabase = createClient()

    // First, get the account associated with the current user
    const { data: userAccount, error: userAccountError } = await supabase
      .from('user_accounts')
      .select('account_id')
      .eq('user_id', user.id)
      .single()

    if (userAccountError) throw new Error('Failed to retrieve user account')

    // Now update the account with the mailing address
    const { error } = await supabase
      .from('accounts')
      .update({ street_address: streetAddress, city, state, postal_code: postalCode, country })
      .eq('id', userAccount.account_id)

    if (error) throw new Error('Failed to save mailing address data')
    return { success: true }
  })