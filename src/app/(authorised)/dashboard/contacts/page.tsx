import { Suspense } from 'react';
import ContactsTable from '@/components/contacts-table';
import AddContactButton from '@/components/add-contact-button';
import { createClient } from '@/lib/supabase/server';
import { TableSkeleton } from '@/components/table-skeleton';

async function getContacts() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('contacts')
    .select('id, first_name, last_name, email, phone_number, created_at');

  if (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }

  return data || [];
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>
      <AddContactButton />
      <Suspense fallback={<TableSkeleton />}>
        <ContactsTable contacts={contacts} />
      </Suspense>
    </div>
  );
}