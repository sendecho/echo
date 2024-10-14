'use server'

import { createClient } from '@/lib/supabase/server'

const supabase = createClient()

export async function unsubscribeMutation(contactId: string) {
  const { data, error } = await supabase
    .from('contacts')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('id', contactId)
    .select()
    .single()

  if (error) throw new Error(`Failed to unsubscribe: ${error.message}`)
  return data
}