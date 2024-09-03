import { Suspense } from 'react';
import ContactsTable from '@/components/contacts-table';
import AddContactButton from '@/components/add-contact-button';
import { TableSkeleton } from '@/components/table-skeleton';
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { getContacts } from '@/lib/supabase/queries/contacts.cached';

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>
      <AddContactButton />
      <Suspense fallback={<TableSkeleton />}>
        <ContactsTable contacts={contacts} />
      </Suspense>
    </DashboardLayout>
  );
}