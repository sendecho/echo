import { ListManager } from '@/components/list-manager'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { getUser } from '@/lib/supabase/queries/user.cached';

export default async function ListsPage() {

  const user = await getUser();
  const accountId = user?.data.account_id;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Mailing Lists</h1>
      <ListManager accountId={accountId} />
    </DashboardLayout>
  )
}
