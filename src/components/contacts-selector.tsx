"use client";

import { useEffect, useState } from 'react'
import { fetchContacts } from '@/lib/supabase/queries/contacts';
import { MultiSelect } from '@/components/ui/multi-select'
import { SubmitButton } from './ui/submit-button';
import { createClient } from '@/lib/supabase/client';
import { getCurrentUserAccountQuery } from '@/lib/supabase/queries/user';


type Contact = {
  id: string
  first_name?: string
  last_name?: string
}

export function ContactSelector({ onSend, isSendingEmail }: { onSend: (selectedContacts: string[]) => void, isSendingEmail: boolean }) {

  const supabase = createClient();

  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])


  useEffect(() => {
    async function fetchData() {
      const userData = await getCurrentUserAccountQuery(supabase)

      if (userData?.data?.account_id) {
        const response = await fetchContacts(supabase, userData?.data?.account_id)

        if (response.length > 0) {
          setContacts(
            response.map(contact => ({
              id: contact.id,
              first_name: contact.first_name || '',
              last_name: contact.last_name || '',
            }))
          )
        }
      }
    }

    if (!contacts.length) {
      fetchData()
    }
  }, [])


  return (
    <div className="space-y-4">
      <MultiSelect
        title="Select contacts"
        options={contacts.map(contact => ({ value: contact.id, label: `${contact.first_name} ${contact.last_name}` }))}
        selectedValues={new Set(selectedContacts)}
        onSelectionChange={(selectedValues) => setSelectedContacts(Array.from(selectedValues))}
      />
      <div className="flex justify-between items-center">
        <SubmitButton isSubmitting={isSendingEmail} onClick={() => onSend(selectedContacts)} disabled={selectedContacts.length === 0}>
          Send to Selected Contacts
        </SubmitButton>
      </div>
    </div>
  )
}