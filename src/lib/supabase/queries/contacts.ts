'use server'

import { createClient } from '@/lib/supabase/server'

interface Contact {
  id: number
  first_name: string
  last_name: string
  email: string
}

export async function fetchContacts(): Promise<Contact[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('contacts')
    .select('id, first_name, last_name, email')
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching contacts:', error)
    throw new Error('Failed to fetch contacts')
  }

  return data || []
}
