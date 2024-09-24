"use server"

import { actionClient, authSafeAction } from "@/lib/safe-action"
import { emailSetupSchema, domainVerificationSchema, mailingAddressSchema } from '@/lib/schemas/onboarding-schema'
import { createClient } from '@/lib/supabase/server'
import { Resend } from "resend"
import { fetchAccountSettings } from '@/lib/supabase/queries/account-settings'
import { verifyDomainResend } from '@/lib/resend'

export const emailSetupAction = authSafeAction
  .schema(emailSetupSchema)
  .metadata({
    name: 'email-setup',
  })
  .action(async ({ parsedInput: { name, domain }, ctx: { user } }) => {
    const supabase = createClient()

    let accountId: string | null = null

    // Check if user has an account already
    if (user.account_id) {
      // then update the account
      const { error: updateError } = await supabase
        .from('accounts')
        .update({
          name: name,
          domain: domain,
        })
        .eq('id', user.account_id)
        .throwOnError()
      accountId = user.account_id

      if (updateError) throw new Error(`Failed to update account: ${updateError.message}`)
    } else {
      // Create a new account and link the user
      const { data: newAccountData, error: newAccountError } = await supabase.rpc('create_account_and_link_user', {
        name: name,
        domain: domain,
        user_id: user.id,
      }).throwOnError()

      if (newAccountError) throw new Error('Failed to create account and link user')

      accountId = newAccountData
    }


    // Create a domain in Resend
    const resend = new Resend(process.env.RESEND_API_KEY)
    const domains = await resend.domains.list();

    // Check if the domain already exists
    const domainExists = domains?.data?.data.find((d) => d.name === domain)
    if (domainExists) {
      // TODO: Should we update the domain instead of throwing an error?
      // What's the privacy concern here?
      throw new Error('Domain already exists')
    }

    const resendDomain = await resend.domains.create({ name: domain })

    // If there was an error creating the domain, throw an error unless it's a 403 
    if (resendDomain.error) {
      if (resendDomain.error.name !== 'validation_error') {
        throw new Error('Failed to create domain in Resend')
      }
    }

    // Add the domain to the account
    const { error: addDomainError } = await supabase
      .from('accounts')
      .update({ resend_domain_id: resendDomain.data?.id })
      .eq('id', accountId)
      .throwOnError()

    if (addDomainError) throw new Error('Failed to add domain to account')

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
  .action(async ({ parsedInput: { street_address, city, state, postal_code, country }, ctx: { user } }) => {
    const supabase = createClient()
    // Now update the account with the mailing address
    const { error } = await supabase
      .from('accounts')
      .update({ street_address, city, state, postal_code, country })
      .eq('id', user.account_id)
      .throwOnError()

    if (error) throw new Error('Failed to save mailing address data')
    return { success: true }
  })

export const verifyDomain = authSafeAction
  .metadata({
    name: 'verify-domain',
  })
  .action(async ({ ctx: { user } }) => {
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    const accountData = await fetchAccountSettings(user?.account_id || undefined)
    if (!accountData?.resend_domain_id) {
      return { success: false, error: 'No domain found for verification' }
    }

    try {
      const result = await verifyDomainResend(accountData.resend_domain_id)
      if (result.status === 'verified') {
        return { success: true }
      } else {
        return { success: false, error: 'Domain not verified yet. Please check your DNS settings and try again.' }
      }
    } catch (error) {
      console.error('Error verifying domain:', error)
      return { success: false, error: 'An error occurred while verifying the domain' }
    }
  })