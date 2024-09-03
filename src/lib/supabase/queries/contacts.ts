'use server'

import { createClient } from '@/lib/supabase/server'
import { Client } from '@/types'

interface Contact {
  id: number
  first_name: string
  last_name: string
  email: string
}

export async function fetchContacts(supabase: Client, accountId: string): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      id, 
      first_name, 
      last_name, 
      email, 
      phone_number, 
      created_at,
      lists:list_contacts(list:lists(id, name))
    `)
    .eq('account_id', accountId)
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching contacts:', error)
    throw new Error('Failed to fetch contacts')
  }

  return data || []
}

export async function getRecentBroadcasts(contactId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('outbound_emails')
    .select('id, sent_at, email:emails(*)')
    .eq('contact_id', contactId)
    .order('sent_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching broadcasts:', error)
    return []
  }

  return data || []
}
