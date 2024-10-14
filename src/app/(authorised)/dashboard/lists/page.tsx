import { ListManager } from "@/components/list-manager";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { getUser } from "@/lib/supabase/queries/user.cached";
import { fetchContacts } from "@/lib/supabase/queries/contacts";
import { fetchLists } from "@/lib/supabase/queries/lists";
import { getContacts } from "@/lib/supabase/queries/contacts.cached";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
	title: "Mailing Lists",
	description: "Create and manage your mailing lists",
};

export default async function ListsPage() {
	const supabase = createClient();
	const user = await getUser();
	const accountId = user?.data?.account_id;

	const [contacts, lists] = await Promise.all([
		getContacts(),
		fetchLists(supabase, accountId),
	]);

	return (
		<DashboardLayout>
			<div className="flex flex-col gap-8">
				<h1 className="text-3xl font-bold">Mailing Lists</h1>
				<ListManager
					accountId={accountId || ""}
					lists={lists}
					contacts={contacts}
				/>
			</div>
		</DashboardLayout>
	);
}
