import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { fetchBroadcastById } from '@/lib/supabase/queries/broadcasts'
import { BroadcastDetails } from '@/components/broadcast-details'
import { TableSkeleton } from '@/components/table-skeleton'
import DashboardLayout from '@/components/layouts/dashboard-layout'

export default async function BroadcastPage({ params }: { params: { id: string } }) {
  const broadcast = await fetchBroadcastById(params.id)

  if (!broadcast) {
    notFound()
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">{broadcast.subject}</h1>
      <Suspense fallback={<TableSkeleton />}>
        <BroadcastDetails broadcast={broadcast} />
      </Suspense>
    </DashboardLayout>
  )
}
