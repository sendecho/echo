'use server'

import { createClient } from '@/lib/supabase/server'
import type { Client } from '@/types'
import { createAdminClient } from '../admin'

interface UpdateAccountSettingsProps {
  account_id: string
  name?: string
  domain?: string
  from_name?: string
  street_address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
}

export async function updateAccountSettingsMutation(props: UpdateAccountSettingsProps) {
  const supabase = createClient()

  console.log(props)

  const { data, error } = await supabase
    .from('accounts')
    .update({
      name: props.name,
      domain: props.domain,
      from_name: props.from_name,
      street_address: props.street_address,
      city: props.city,
      state: props.state,
      postal_code: props.postal_code,
      country: props.country,
    })
    .eq('id', props.account_id)
    .select()
    .single()
    .throwOnError()

  if (error) throw new Error(`Failed to update account settings: ${error.message}`)
  return data
}

interface UpdateAccountBillingProps {
  stripe_customer_id?: string
  stripe_subscription_id: string | null
  stripe_product_id: string | null
  plan_name: string | null
  subscription_status: string
}

export async function updateAccountSubscription(supabase: Client, accountId: string, subscriptionData: UpdateAccountBillingProps) {
  const { data, error } = await supabase
    .from('accounts')
    .update({
      ...subscriptionData,
      updated_at: new Date(),
    })
    .eq('id', accountId)
    .select()
    .single()
    .throwOnError()

  if (error) throw new Error(`Failed to update account billing: ${error.message}`)
  return data
}

// export async function updateAccountSubscriptionDetails(supabase: Client, accountId: string, subscriptionData: UpdateAccountBillingProps) {

//   console.log(accountId, subscriptionData)


//   const { data, error } = await supabase
//     .rpc('update_account_subscription_details', {
//       p_account_id: accountId,
//       p_stripe_product_id: subscriptionData.stripe_product_id,
//       p_stripe_subscription_id: subscriptionData.stripe_subscription_id,
//       p_subscription_status: subscriptionData.subscription_status,
//       p_plan_name: subscriptionData.plan_name,
//     })
//     .select()
//     .single()
//     .throwOnError()

//   if (error) throw new Error(`Failed to update account subscription details: ${error.message}`)
//   return data
// }


export async function updateAccountSubscriptionDetails(accountId: string, subscriptionData: UpdateAccountBillingProps) {

  console.log(subscriptionData);

  const supabase = createAdminClient()
  const { data, error } = await supabase.from('accounts').update({
    ...subscriptionData,
    updated_at: new Date().toISOString(),
  }).eq('id', accountId).select().single().throwOnError()

  if (error) throw new Error(`Failed to update account subscription details: ${error.message}`)
  return data
}
