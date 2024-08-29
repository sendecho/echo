import { Suspense } from 'react'
import { AccountDetails } from '@/components/account/account-details'
import { AccountSkeleton } from '@/components/account/account-skeleton'

export const metadata = {
  title: 'Account Details',
  description: 'View and manage your account details',
}

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Account Details</h1>
      <Suspense fallback={<AccountSkeleton />}>
        <AccountDetails />
      </Suspense>
    </div>
  )
}
