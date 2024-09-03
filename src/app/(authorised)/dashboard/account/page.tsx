import { Suspense } from 'react'
import { AccountDetails } from '@/components/account/account-details'
import { AccountSkeleton } from '@/components/account/account-skeleton'
import DashboardLayout from '@/components/layouts/dashboard-layout'

export const metadata = {
  title: 'Account Details',
  description: 'View and manage your account details',
}

export default function AccountPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Account Details</h1>
      <Suspense fallback={<AccountSkeleton />}>
        <AccountDetails />
      </Suspense>
    </DashboardLayout>
  )
}
