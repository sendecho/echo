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
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">Contacts</h1>
          <AddContactButton />
        </div>
        <Suspense fallback={<TableSkeleton />}>
          <ContactsTable contacts={contacts} />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}