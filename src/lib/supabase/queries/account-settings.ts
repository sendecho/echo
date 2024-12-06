'use server'

import { createClient } from '@/lib/supabase/server'
import type { Client } from '@/types'

export async function fetchAccountSettings(accountId?: string) {
  // If no accountId is provided, return null
  if (!accountId) {
    return null
  }

  const supabase = createClient()

  const { data, error } = await supabase
    .from('accounts')
    .select('name, domain, from_name, street_address, city, state, postal_code, country, resend_domain_id, stripe_customer_id, stripe_subscription_id, stripe_product_id, plan_name, subscription_status')
    .eq('id', accountId)
    .single()

  if (error) throw new Error(`Failed to fetch account settings: ${error.message}`)
  return data
}

export async function getAccountByStripeCustomerId(supabase: Client, stripeCustomerId: string) {
  console.log('stripeCustomerId', stripeCustomerId)

  const { data, error } = await supabase
    .rpc('get_account_by_stripe_customer_id', { p_stripe_customer_id: stripeCustomerId })
    .single()

  if (error) throw new Error(`Failed to fetch account by Stripe customer ID: ${error.message}`)
  return data
}

export async function fetchAPIKeys(accountId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch API keys: ${error.message}`)
  return data
}

export async function fetchDomainSettings(accountId?: string) {
  // If no accountId is provided, return null
  if (!accountId) {
    return null
  }

  const supabase = createClient()

  const { data, error } = await supabase
    .from('accounts')
    .select('id, domain, domain_verification_status, resend_domain_id')
    .eq('id', accountId)
    .single()

  if (error) throw new Error(`Failed to fetch domain settings: ${error.message}`)
  return data
}