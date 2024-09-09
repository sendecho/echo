'use server'

import { createClient } from '@/lib/supabase/server'

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