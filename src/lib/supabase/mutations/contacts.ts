'use server'

import { createClient } from '@/lib/supabase/server'

interface Contact {
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  account_id: string
  source: string
}

interface ContactWithLists extends Contact {
  lists?: string[]
}

export async function upsertContactsMutation(contacts: ContactWithLists[]) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('contacts')
      .upsert(contacts.map(({ lists, ...contact }) => contact), {
        onConflict: 'email,account_id',
        ignoreDuplicates: false
      })
      .select()

    if (error) throw new Error(`Failed to upsert contacts: ${error.message}`)

    // Handle list assignments
    for (const contact of contacts) {
      if (contact.lists && contact.lists.length > 0) {
        const contactData = data.find(c => c.email === contact.email)
        if (contactData) {
          const { error: listError } = await supabase
            .from('list_contacts')
            .upsert(
              contact.lists.map(listId => ({
                contact_id: contactData.id,
                list_id: listId
              })),
              { onConflict: 'contact_id,list_id' }
            )
          if (listError) {
            console.error(`Failed to assign lists for contact ${contactData.email}:`, listError)
            // Consider whether to throw an error here or continue with other contacts
          }
        }
      }
    }

    return data
  } catch (error) {
    console.error('Error in upsertContactsMutation:', error)
    throw error
  }
}