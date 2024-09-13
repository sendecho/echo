'use server'

import { createClient } from '@/lib/supabase/server'

export async function fetchAccountSettings(accountId?: string) {
  // If no accountId is provided, return null
  if (!accountId) {
    return null
  }

  const supabase = createClient()

  const { data, error } = await supabase
    .from('accounts')
    .select('name, domain, from_name, street_address, city, state, postal_code, country, resend_domain_id')
    .eq('id', accountId)
    .single()

  if (error) throw new Error(`Failed to fetch account settings: ${error.message}`)
  return data
}