'use server'

import { createClient } from '@/lib/supabase/server'

export async function fetchLists() {
  const supabase = createClient()

  const { data: lists, error } = await supabase
    .from('lists')
    .select('*, list_contacts (count)')
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


export async function fetchContactsForList(listId: string) {
  const supabase = createClient()

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