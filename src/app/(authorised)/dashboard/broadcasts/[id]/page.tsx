import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { fetchBroadcastById } from '@/lib/supabase/queries/broadcasts'
import { BroadcastDetails } from '@/components/broadcast-details'
import { TableSkeleton } from '@/components/table-skeleton'

export default async function BroadcastPage({ params }: { params: { id: string } }) {
  const broadcast = await fetchBroadcastById(params.id)

  if (!broadcast) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{broadcast.subject}</h1>
      <Suspense fallback={<TableSkeleton />}>
        <BroadcastDetails broadcast={broadcast} />
      </Suspense>
    </div>
  )
}
