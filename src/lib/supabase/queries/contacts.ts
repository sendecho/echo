import type { Client } from '@/types'


export async function fetchContacts(supabase: Client, accountId: string) {
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
    .throwOnError()

  if (error) {
    console.error('Error fetching contacts:', error)
    throw new Error('Failed to fetch contacts')
  }

  return data || []
}

export async function getRecentBroadcasts(supabase: Client, contactId: string) {
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
