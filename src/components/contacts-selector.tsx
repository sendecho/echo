"use client";

import { useEffect, useState } from 'react'
import { fetchContacts } from '@/lib/supabase/queries/contacts';
import { MultiSelect } from '@/components/ui/multi-select'
import { Button } from '@/components/ui/button'
import { SubmitButton } from './ui/submit-button';
import { createClient } from '@/lib/supabase/client';

export function ContactSelector({ onSend, isSendingEmail }: { onSend: (selectedContacts: number[]) => void, isSendingEmail: boolean }) {

  const supabase = createClient();

  const [selectedContacts, setSelectedContacts] = useState<number[]>([])
  const [contacts, setContacts] = useState<Awaited<ReturnType<typeof fetchContacts>>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadContacts() {
      try {
        setIsLoading(true)
        const fetchedContacts = await fetchContacts(supabase, '')
        setContacts(fetchedContacts)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch contacts'))
      } finally {
        setIsLoading(false)
      }
    }

    loadContacts()
  }, [])

  if (isLoading) return <div>Loading contacts...</div>
  if (error) return <div>Error loading contacts: {error.message}</div>

  console.log(selectedContacts)

  return (
    <div className="space-y-4">
      <MultiSelect
        title="Select contacts"
        options={contacts.map(contact => ({ value: contact.id.toString(), label: `${contact.first_name} ${contact.last_name}` }))}
        selectedValues={new Set(selectedContacts.map(String))}
        onSelectionChange={(selectedValues) => setSelectedContacts(Array.from(selectedValues).map(Number))}
      />
      <div className="flex justify-between items-center">
        <SubmitButton isSubmitting={isSendingEmail} onClick={() => onSend(selectedContacts)} disabled={selectedContacts.length === 0}>
          Send to Selected Contacts
        </SubmitButton>
      </div>
    </div>
  )
}