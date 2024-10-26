import { Suspense } from "react";
import ContactsTable from "@/components/contacts-table";
import AddContactButton from "@/components/add-contact-button";
import { ImportContactsButton } from "@/components/import-contacts-button";
import { TableSkeleton } from "@/components/table-skeleton";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { getContacts } from "@/lib/supabase/queries/contacts.cached";
import { PageHeader } from "@/components/page-header";

export const metadata = {
	title: "Contacts",
	description: "Create and manage your contacts",
};

export default async function ContactsPage() {
	const contacts = await getContacts();

	return (
		<DashboardLayout>
			<div className="flex flex-col">
				<PageHeader
					title="Contacts"
					description="Create and manage your contacts"
					actions={[
						<ImportContactsButton key="import-contacts-button" />,
						<AddContactButton key="add-contact-button" />,
					]}
				/>
				<Suspense fallback={<TableSkeleton />}>
					<ContactsTable
						contacts={
							contacts?.map((contact) => ({
								...contact,
								created_at: contact.created_at || "",
								// Add any other nullable fields here
							})) || []
						}
					/>
				</Suspense>
			</div>
		</DashboardLayout>
	);
}
