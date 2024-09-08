import { ListManager } from '@/components/list-manager'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { getUser } from '@/lib/supabase/queries/user.cached';

export default async function ListsPage() {

  const user = await getUser();
  const accountId = user?.data?.account_id;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Mailing Lists</h1>
        <ListManager accountId={accountId || ''} />
      </div>
    </DashboardLayout>
  )
}
