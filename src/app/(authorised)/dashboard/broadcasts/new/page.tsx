import { BroadcastEditor } from '@/components/broadcast-editor'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { fetchAccountSettings } from '@/lib/supabase/queries/account-settings'
import { getUser } from '@/lib/supabase/queries/user.cached'

export default async function NewBroadcast() {
  const { data: user } = await getUser()
  const accountSettings = await fetchAccountSettings(user?.account_id)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold mb-4">New Broadcast</h1>
        <BroadcastEditor initialBroadcast={{
          from_name: accountSettings?.from_name
            ? `${accountSettings.from_name}`
            : accountSettings?.name || '',
          from_email: `no-reply@${accountSettings?.domain || ''}`,
          subject: '',
          content: '',
          preview: null,
        }} />
      </div>
    </DashboardLayout>
  )
}