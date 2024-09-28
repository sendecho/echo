import type { Client } from '@/types'

export async function fetchLists(supabase: Client, accountId: string) {
  const { data: lists, error } = await supabase
    .from('lists')
    .select('*, list_contacts (count)')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching lists:', error)
    return []
  }

  return lists.map(list => ({
    ...list,
    contactCount: list.list_contacts[0]?.count ?? 0
  }))
}


export async function fetchContactsForList(supabase: Client, listId: string) {
  const { data, error } = await supabase
    .from('list_contacts')
    .select(`
      contact_id,
      contacts (
        id,
        first_name,
        last_name,
        email
      )
    `)
    .eq('list_id', listId);

  if (error) {
    console.error('Error fetching contacts for list:', error);
    throw new Error('Failed to fetch contacts for list');
  }

  return data.map(item => item.contacts);
}